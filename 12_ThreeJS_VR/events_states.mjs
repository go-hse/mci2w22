///////////////////////////////////////////////////////////////////////////////
//
function EventBus() {
	let listeners = [];

	function subscribe(event, callback) {
		if (!listeners[event]) {
			listeners[event] = [];
		}
		listeners[event].push(callback);
	};


	function publish(event, obj) {
		if (listeners[event]) {
			for (let cb of listeners[event]) {
				cb(obj);
			}
		} else {
			console.log(`no listener for ${event}`);
		}
	};
	return { subscribe, publish };
};

export const eventbus = EventBus();


export function Statemachine(states) {
	let currentstate = "main";

	function addState(thisstate, event, nextstate) {
		eventbus.subscribe(event, () => {
			if (currentstate === thisstate) {
				eventbus.publish(thisstate, false);
				eventbus.publish("addline", `${event}: ${currentstate} -> ${nextstate}`);
				currentstate = nextstate;
				eventbus.publish(currentstate, true);
			}
		});
	}

	states.forEach(state => {
		for (const thisstate in state) {
			const followers = state[thisstate];
			for (const event in followers) {
				addState(thisstate, event, followers[event]);
			}
		}
	});

	return () => {
		return currentstate;
	}
}


const states = [{
	main: {
		grabOn: "grabbing",
		lightOn: "doSomething",
	},
	grabbing: {
		grabOff: "main",
	},
	doSomething: {
		lightOff: "main",
	},

}];

export const getState = Statemachine(states);

eventbus.subscribe("grabbing", (o) => {
	console.log(`grabbing ${o}`);
});

eventbus.publish("grabOn", `date: ${new Date()}`);
eventbus.publish("grabOff", `date: ${new Date()}`);





