
module.exports = {
   buildUrl(params) {
    let url = '';
    for(let i = 0; i < params.length; i++) {
        url += '&' + params[i];
    }
    return url;
  },

  parseUrl(data) {
    let result = [];
    let items = data.items;
    let num_items = Object.keys(items).length;

    if (num_items > 0) {
      for (let i = 0; i < num_items; i++) {
        let item = data.items[i];
        result.push({
            "url": data.items[i].link,
            "snippet": data.items[i].snippet,
            "thumbnail": data.items[i].image.thumbnailLink,
            "context": data.items[i].image.contextLink
        });
      }
    }
    return result;
  }
};
