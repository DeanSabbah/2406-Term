var tags = {'tag1':100, 'tag2':100, 'tag3':100, 'tag4':100, 'tag5':100, 'tag6':100,'tag7':100}
var tag_ar = [];
var n = 0
for(var item in tags){
    tag_ar[n] = item;
    n++;
}

tags = tag_ar
console.log(tags)