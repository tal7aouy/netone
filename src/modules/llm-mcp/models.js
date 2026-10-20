export const candidates = [' Paris', ' Lyon', ' a', ' unknown'];
export function probabilities(temperature = 1) {
  if (!Number.isFinite(temperature) || temperature <= 0) throw new RangeError('Temperature must be positive');
  const scaled = [3.2, 1.4, 0.8, 0.2].map(v => v / temperature);
  const max = Math.max(...scaled);
  const exps = scaled.map(v => Math.exp(v-max));
  const total = exps.reduce((a,b) => a+b,0);
  return exps.map(v => v / total);
}
export function sampleIndex(distribution, random = Math.random()) {
  if (random < 0 || random >= 1) throw new RangeError('Random value must be in [0,1)');
  let total = 0;
  for (let i=0;i<distribution.length;i++) { total+=distribution[i]; if(random<total) return i; }
  return distribution.length-1;
}
// Deliberately invented vocabulary: IDs remain stable when the input changes.
export function tokenizeDemo(text) {
  const pieces = text.match(/\s*[\p{L}\p{N}]+|\s*[^\p{L}\p{N}\s]|\s+/gu) || [];
  return pieces.flatMap(piece => Array.from(piece).length > 8 ? [Array.from(piece).slice(0,5).join(''),Array.from(piece).slice(5).join('')] : [piece]);
}
export function attentionWeights(position, size = 6) {
  const visible = Array.from({length:size},(_,i) => i<=position ? i+1 : 0);
  const sum = visible.reduce((a,b)=>a+b,0);
  return visible.map(v=>v/sum);
}
export const toolDefinition = {name:'lookup_order', description:'Read shipping status for an order the signed-in user can access.', inputSchema:{type:'object',properties:{order_id:{type:'string'}},required:['order_id'],additionalProperties:false}};
const request = (id,method,params) => ({jsonrpc:'2.0',id,method,...(params ? {params} : {})});
const result = (id,value) => ({jsonrpc:'2.0',id,result:value});
export function mcpFrames(failure = false) {
  return [
    {sent:request(1,'initialize',{protocolVersion:'2025-06-18',capabilities:{},clientInfo:{name:'netone-demo',version:'1.0.0'}})},
    {received:result(1,{protocolVersion:'2025-06-18',capabilities:{tools:{}},serverInfo:{name:'orders-demo',version:'1.0.0'}})},
    {sent:{jsonrpc:'2.0',method:'notifications/initialized'}},
    {sent:request(2,'tools/list'),received:result(2,{tools:[toolDefinition]})},
    {sent:request(3,'tools/call',{name:'lookup_order',arguments:{order_id:'1042'}})},
    {received:result(3,{content:[{type:'text',text:failure ? 'Order service is temporarily unavailable.' : '{"order_id":"1042","status":"shipped","carrier":"Demo Post"}'}],isError:failure})}
  ];
}
export function agentOutcome(scenario) {
  if (scenario==='invalid') return {call:'{"name":"lookup_order","arguments":{"order_id":1042}}',result:'Rejected before execution: order_id must be a string.',answer:'The tool arguments need correction before the order can be checked.'};
  if (scenario==='offline') return {call:'{"name":"lookup_order","arguments":{"order_id":"1042"}}',result:'{"error":"Order service unavailable"}',answer:'I could not check the order because the service is unavailable. No shipping status is confirmed.'};
  return {call:'{"name":"lookup_order","arguments":{"order_id":"1042"}}',result:'{"order_id":"1042","status":"shipped","carrier":"Demo Post"}',answer:'Order 1042 has shipped with Demo Post.'};
}
