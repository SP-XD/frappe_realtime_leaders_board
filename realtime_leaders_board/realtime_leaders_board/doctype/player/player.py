# Copyright (c) 2025, Somnath Paul and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

from realtime_leaders_board.leaderboard_controller import leaderboard as ld


class Player(Document):

    def save(self, *args, **kwargs):
        self._save(*args, **kwargs)

        ld.LeaderboardController.update_leaderboard

        print("triggered on save")


