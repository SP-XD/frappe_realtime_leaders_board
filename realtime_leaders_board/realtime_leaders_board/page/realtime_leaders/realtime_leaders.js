frappe.pages["realtime-leaders"].on_page_load = function (wrapper) {
	let page = frappe.ui.make_app_page({
		parent: wrapper,
		title: "Mini Game + Real-time Leaderboard",
		single_column: true,
	});

	// ========== Leaderboard UI =============
	$(frappe.render_template("realtime_leaders", {})).appendTo(page.body);

	// ========== Mini-game Logic ==========
	const gameContainer = page.body.find("#game-container")[0];
	const targetBox = page.body.find("#target-box")[0];
	const scoreDisplay = page.body.find("#game-score")[0];
	const resetButton = page.body.find("#reset-game")[0];
	const submitButton = page.body.find("#submit-game")[0];

	let gameScore = 0;

	function moveBoxRandomly() {
		const containerRect = gameContainer.getBoundingClientRect();
		const boxRect = targetBox.getBoundingClientRect();

		const maxLeft = containerRect.width - boxRect.width;
		const maxTop = containerRect.height - boxRect.height;

		const randomLeft = Math.random() * maxLeft;
		const randomTop = Math.random() * maxTop;

		targetBox.style.left = randomLeft + "px";
		targetBox.style.top = randomTop + "px";
	}

	targetBox.addEventListener("click", () => {
		gameScore += 1;
		scoreDisplay.innerText = gameScore;
		moveBoxRandomly();
	});

	resetButton.addEventListener("click", () => {
		gameScore = 0;
		scoreDisplay.innerText = "0";
		moveBoxRandomly();
	});

	submitButton.addEventListener("click", () => {
		submitScore(gameScore);
	});

	// initialize box
	moveBoxRandomly();

	function submitScore(score) {
		frappe.call({
			method: "realtime_leaders_board.api.endpoints.submit_game_score",
			type: "POST",
			args: { player_email: frappe.session.user_email, score: gameScore },
			callback: (r) => {
				// maybe fetch the updated leaderboard again
				console.log("Response of submit score: " + r);
			},
		});
	}

	// ========== Leaderboard Logic ==========
	// Load canvas-confetti from CDN
	function loadConfettiScript(cb) {
		if (window.confetti) return cb();
		const script = document.createElement("script");
		script.src =
			"https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js";
		script.onload = cb;
		document.head.appendChild(script);
	}

	function showConfetti() {
		loadConfettiScript(() => {
			const canvas = document.getElementById("confetti-canvas");
			// canvas.width = canvas.parentElement.offsetWidth;
			// canvas.height = 120;
			window.confetti.create(canvas, { resize: true })({
				particleCount: 80,
				spread: 70,
				origin: { y: 0.3 },
			});
			// setTimeout(() => {
			// 	canvas.width = 0;
			// 	canvas.height = 0;
			// }, 1200);
		});
	}

	function renderLeaderboard(data) {
		let tbody = page.body.find("#leaderboard-body");
		tbody.empty();

		console.log(frappe.session);
		console.log(data[0].email);

		// Confetti for rank 1 change
		if (data.length && data[0].email == frappe.session.user_email) {
			showConfetti();
			lastRank1 = data[0].username;
		}

		// no need sort as data is already sorted from db fetch
		// data.sort((a, b) => b.score - a.score);
		data.forEach((row, idx) => {
			tbody.append(`<tr>
                <td>${idx + 1}</td>
                <td>${row.username}</td>
                <td>${row.score}</td>
            </tr>`);
		});
	}

	// initial fetch
	frappe.call({
		method: "realtime_leaders_board.api.endpoints.get_leaderboard",
		type: "GET",
		callback: (r) => {
			if (r.message) {
				renderLeaderboard(r.message);
			}
		},
	});

	// realtime updates
	frappe.realtime.on("notify_leaderboard", (data) => {
		renderLeaderboard(data);
	});
};
