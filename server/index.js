import DiffMatchPatch from 'diff-match-patch';

const dmp = new DiffMatchPatch();
const diff = dmp.diff_main('dogs bark', 'cats bark');
dmp.diff_cleanupSemantic(diff);
 
// You can also use the following properties:
DiffMatchPatch.DIFF_DELETE = -1;
DiffMatchPatch.DIFF_INSERT = 1;
DiffMatchPatch.DIFF_EQUAL = 0;

const patches = dmp.patch_make(diff);

const results = dmp.patch_apply(patches, 'dogs bark');

console.log(results[0]);
console.log("diff", JSON.stringify(diff), JSON.stringify(patches), JSON.stringify(results));