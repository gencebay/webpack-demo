export var PubSub;
(function (PubSub) {
    var topics = {};
    var subUid = -1;
    function publish(topic, context) {
        if (!topics[topic]) {
            return false;
        }
        setTimeout(function () {
            var subscribers = topics[topic], len = subscribers ? subscribers.length : 0;
            while (len--) {
                subscribers[len].func(topic, context);
            }
        }, 0);
        return true;
    }
    PubSub.publish = publish;
    function subscribe(topic, func) {
        if (!topics[topic]) {
            topics[topic] = [];
        }
        var token = (++subUid).toString();
        topics[topic].push({
            token: token,
            func: func
        });
        return token;
    }
    PubSub.subscribe = subscribe;
    function unsubscribe(token) {
        for (var m in topics) {
            if (topics[m]) {
                for (var i = 0, j = topics[m].length; i < j; i++) {
                    if (topics[m][i].token === token) {
                        topics[m].splice(i, 1);
                        return token;
                    }
                }
            }
        }
        return false;
    }
    PubSub.unsubscribe = unsubscribe;
})(PubSub || (PubSub = {}));
