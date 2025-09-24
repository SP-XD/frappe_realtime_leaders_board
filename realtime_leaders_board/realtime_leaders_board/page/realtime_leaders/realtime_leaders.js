frappe.pages["realtime-leaders"].on_page_load = function (wrapper) {
	let page = frappe.ui.make_app_page({
		parent: wrapper,
		title: "Real-time Leaderboard",
		single_column: true,
	});

	page.body.html(`
        <div class="leaderboard-container">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player Username</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody id="leaderboard-body"></tbody>
            </table>
        </div>
    `);

	// Realtime listener
	frappe.realtime.on("notify_leaderboard", function (data) {
		render_leaderboard(data);
	});

	// First fetch
	frappe.call({
		method: "realtime_leaders_board.api.endpoints.get_leaderboard",
		type: "GET",
		callback: function (r) {
			if (r.message) {
				render_leaderboard(r.message);
			}
		},
	});

	function render_leaderboard(data) {
		let tbody = $("#leaderboard-body");
		tbody.empty();

		// Not required, as data received is sorted
		// data.sort((a, b) => b.score - a.score);

		data.forEach((row, index) => {
			tbody.append(`
                <tr>
                    <td>${index + 1}</td>
                    <td>${row.username}</td>
                    <td>${row.score}</td>
                </tr>
            `);
		});
	}
};
