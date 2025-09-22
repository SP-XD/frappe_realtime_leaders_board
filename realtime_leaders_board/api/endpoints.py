import frappe

@frappe.whitelist(methods=["GET"]) # type: ignore
def get_leaderboard():
    # Fetch all players and their scores, sorted by score descending
    players = frappe.get_all(   # type: ignore
        "Player",
        fields=["name", "score"],
        order_by="score desc"
    )

    print(hasattr(frappe, "publish_realtime"))
    print(hasattr(frappe.realtime, "publish_realtime")) # type: ignore
    return players
