frappe.pages["realtime-leaders"].on_page_load = function (wrapper) {
	let page = frappe.ui.make_app_page({
		parent: wrapper,
		title: "Real-time Leaderboard",
		single_column: true,
	});

	// Directly insert HTML instead of render_template
	page.body.html(`
        <div class="leaderboard-container">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody id="leaderboard-body"></tbody>
            </table>
        </div>
    `);

	// Realtime listener
	frappe.realtime.on("update_leaderboard", function (data) {
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

		// Sort by score desc
		data.sort((a, b) => b.score - a.score);

		data.forEach((row, index) => {
			tbody.append(`
                <tr>
                    <td>${index + 1}</td>
                    <td>${row.name}</td>
                    <td>${row.score}</td>
                </tr>
            `);
		});
	}
};
