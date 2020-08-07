import DiffMatchPatch from 'diff-match-patch';

const dmp = new DiffMatchPatch();

const text1 = `
hola
chao`;
const text2 = `
hola
chaochao`;
const text3 = `
holahola
chao`;
// let text = "";

// var patches = dmp.patch_fromText(text);
// var results = dmp.patch_apply(patches, init);

// console.log('result\n', results[0], "\n", text);
// text = results[0];

// var patches = dmp.patch_fromText(text);
// var results = dmp.patch_apply(patches, msg);

// console.log('result\n', results[0], "\n", text);

var diff = dmp.diff_main(text1, text2, true);

if (diff.length > 2) {
  dmp.diff_cleanupSemantic(diff);
}

var patch_list = dmp.patch_make(text1, text2, diff);
var patch_text = dmp.patch_toText(patch_list);

var patches = dmp.patch_fromText(patch_text);

var results = dmp.patch_apply(patches, text3);

console.log('result\n', results[0]);