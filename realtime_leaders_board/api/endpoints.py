import frappe


@frappe.whitelist(methods=["GET"])
def get_leaderboard():
    # Fetch all players and their scores, sorted by score descending
    # Using SQL to join Player with User
    players = frappe.db.sql("""
        SELECT p.user AS user_id,
               u.username,
               u.full_name,
               p.score,
               u.email
        FROM `tabPlayer` p
        LEFT JOIN `tabUser` u ON u.email = p.user
        ORDER BY p.score DESC
    """, as_dict=True)

    print("DEBUG: get_leaderboard", players)

    return players

@frappe.whitelist(methods=["POST"])
def submit_game_score(player_email, score):
    try:
        player_name = frappe.get_value("Player", {"user": player_email}, "name")
        print("DEBUG player_name:", player_name)

        if not player_name:
            return {"success": False, "error": "Player not found"}

        p = frappe.get_doc("Player", str(player_name))
        print("DEBUG player:", p)
        p.set("score", score)
        p.save(ignore_permissions=True)

        return {"success": True}
    except Exception as e:
        print("FATAL: ", e)
        return {"success": False}
