
import frappe

class LeaderboardController:

    def update_leaderboard(self):
        #! fix don't use player.name use player.user.username
        entries = frappe.get_all("Player",
            fields=["name", "score"],
            order_by="score desc"
        )

        frappe.publish_realtime("update_leaderboard", entries)
