# Copyright (c) 2025, Somnath Paul and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

from realtime_leaders_board.leaderboard_controller import leaderboard as ld


class Player(Document):
    # begin: auto-generated types
    # This code is auto-generated. Do not modify anything in this block.

    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from frappe.types import DF

        last_updated: DF.Datetime | None
        score: DF.Int
        user: DF.Link | None
    # end: auto-generated types

    def save(self, *args, **kwargs):
        self._save(*args, **kwargs)

        ld.LeaderboardController.notify_leaderboard()

		# Not appearing on bench log, maybe needs setup so not using frappe.log right now, will sort this out later
        # frappe.log("Player notify_leaderboard triggered on save")
        print("DEBUG: Player notify_leaderboard triggered on save")


