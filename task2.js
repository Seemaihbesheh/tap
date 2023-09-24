
// Javascript Question
function Sum(nums, target) {
    let i = 0;
    while (i < nums.length - 1) {
        let j = i + 1;
        while (j < nums.length) {
            if (nums[i] + nums[j] === target) { //=== check if both the value and data type are the same to these
                return [i, j];
            }
            j++;
        }
        i++;
    }
    
    return null;
}

// Main
const nums = [2, 7, 11, 15];
const target = 9;
const res = Sum(nums, target);

if (res !== null) {
    console.log(res);
} 
else if(res == null) {
    console.log("Not found");
}
