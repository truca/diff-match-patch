import DiffMatchPatch from 'diff-match-patch';

const dmp = new DiffMatchPatch();


const initial = "Ians special phone number:";

let text = initial;
function merge(message, previousMessage) {
  var diff = dmp.diff_main(previousMessage, message, true);
  
  var patch_list = dmp.patch_make(previousMessage, message, diff);
  var patch_text = dmp.patch_toText(patch_list);
  var patches = dmp.patch_fromText(patch_text);
  var results = dmp.patch_apply(patches, text);
  
  text = results[0];
  return results[0];
}

function multiMerge(values) {
  const { client_initial_1, client_final_1, client_initial_2, client_final_2, server_initial } = values;

  text = server_initial;
  console.log(`s_initial: "${server_initial}"\n`)
  merge(client_final_1, client_initial_1);
  console.log(`c_initial: "${client_initial_1}", c_final: "${client_final_1}", final: "${text}"\n`);
  merge(client_final_2, client_initial_2);
  console.log(`c_initial: "${client_initial_2}", c_final: "${client_final_2}", final: "${text}"\n\n`);
}

const initial_1 = "Ians special phone number:";
const initial_2 = "Ians special phone number: 777-777-7777";
const client_1 = "Ians special phone number: 858-888-9999";
const client_2 = "Ians special phone number: 555-555-5555";

multiMerge({ client_initial_1: initial_1, client_final_1: client_1, client_initial_2: initial_1, client_final_2: client_2, server_initial: initial })
multiMerge({ client_initial_1: initial_2, client_final_1: client_1, client_initial_2: initial_2, client_final_2: client_2, server_initial: initial })
multiMerge({ client_initial_1: initial_2, client_final_1: client_1, client_initial_2: initial_1, client_final_2: client_2, server_initial: initial })
multiMerge({ client_initial_1: initial_1, client_final_1: client_1, client_initial_2: initial_2, client_final_2: client_2, server_initial: initial })

multiMerge({ client_initial_1: initial_1, client_final_1: client_1, client_initial_2: initial_1, client_final_2: client_2, server_initial: initial_2 })
multiMerge({ client_initial_1: initial_2, client_final_1: client_1, client_initial_2: initial_2, client_final_2: client_2, server_initial: initial_2 })
multiMerge({ client_initial_1: initial_2, client_final_1: client_1, client_initial_2: initial_1, client_final_2: client_2, server_initial: initial_2 })
multiMerge({ client_initial_1: initial_1, client_final_1: client_1, client_initial_2: initial_2, client_final_2: client_2, server_initial: initial_2 })