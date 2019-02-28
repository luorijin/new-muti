export default {
    setItem: function (key, value, days) {
        // 设置过期原则
        if (!value) {
          localStorage.removeItem(key)
        } else {
          var Days = days || 7; // 默认保留7天
          var exp = new Date();
          localStorage[key] = JSON.stringify({
            value,
            expires: exp.getTime() + Days * 24 * 60 * 60 * 1000
          })
        }
      },
      getItem: function (name) {
        try {
          if(!localStorage[name]) return null;
          let o = JSON.parse(localStorage[name])
          if (!o || o.expires < Date.now()) {
            localStorage.removeItem(name);
            return null
          } else {
            return o.value
          }
        } catch (e) {
          console.log(e)
          return localStorage[name]
        } finally {
        }
      },
      clear(key){
        localStorage.removeItem(key);
      }
}