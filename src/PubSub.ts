export namespace PubSub {
    let topics:any = {};
    let subUid:number = -1;
    export function publish(topic:string, context:any) {
        if(!topics[topic]) {
            return false;
        }

        setTimeout(function () {
            var subscribers = topics[topic],
                len = subscribers ? subscribers.length : 0;

            while (len--) {
                subscribers[len].func(topic, context);
            }
        }, 0);

        return true;
    }
    export function subscribe(topic:string, func:(topic:string, context:any) => void) {
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
    export function unsubscribe(token:string) {
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
}