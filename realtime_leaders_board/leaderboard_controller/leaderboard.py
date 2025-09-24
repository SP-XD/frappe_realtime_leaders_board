import frappe


class LeaderboardController:

    @staticmethod
    def notify_leaderboard():
        entries = frappe.db.sql("""
            SELECT p.player AS user_id,
                u.username,
                u.full_name,
                p.score
            FROM `tabPlayer` p
            LEFT JOIN `tabUser` u ON u.email = p.player
        	ORDER BY p.score DESC
        """, as_dict=True)


        print("DEBUG: published frappe.realtime")
        frappe.publish_realtime("notify_leaderboard", entries)
