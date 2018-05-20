const osmosis = require('osmosis');
const PAGINATE_LIMIT = 1000;
const SEARCH_WORD = '豚バラブロック'
osmosis.config('parse_cookies', false) // エンコードされていないcookieが渡されるとページネーション時にcookieのvalidateでコケるため拒否。osmosisのバグ?エンコードされてないcookieが渡ってくるのが問題?
osmosis.config('concurrency', 100);
const result = [];
const command = osmosis
    .get('cookpad.com/search/' + encodeURI(SEARCH_WORD))
    .paginate('a.next', PAGINATE_LIMIT)
    .find('div.recipe-preview span.title a')
    .follow('@href')
    .set({'url': '@href', 'title': 'h1.recipe-title', 'count': 'span.tsukurepo_count'})
    .data(function(p1){
        result.push(p1);
    })
    //.log(console.log)
    //.error(console.log)
    //.debug(console.log)

command.done(function() {
    result.forEach(function (p1, p2, p3) {
        if(p1.count == undefined) {
            p1.count = 0;
        } else {
            p1.count = Number(p1.count);
        }});
    result.sort(function(a, b) {
        if(a.count < b.count) return 1;
        if(a.count > b.count) return -1;
        return 0;
    })
    console.log(result);
});
