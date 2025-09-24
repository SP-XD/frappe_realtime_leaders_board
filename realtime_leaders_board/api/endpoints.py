import frappe


@frappe.whitelist(methods=["GET"])
def get_leaderboard():
    # Fetch all players and their scores, sorted by score descending
    # Using SQL to join Player with User
    players = frappe.db.sql("""
        SELECT p.player AS user_id,
               u.username,
               u.full_name,
               p.score
        FROM `tabPlayer` p
        LEFT JOIN `tabUser` u ON u.email = p.player
        ORDER BY p.score DESC
    """, as_dict=True)

    print("DEBUG: get_leaderboard", players)

    return players
