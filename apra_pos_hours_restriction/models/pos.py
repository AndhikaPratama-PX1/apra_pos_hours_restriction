# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import models, fields, api, _, osv
import pytz
from odoo.exceptions import UserError, ValidationError
from datetime import date, datetime, timedelta

class POSConfig(models.Model):
    _inherit = 'pos.config'


    opening_time_restriction = fields.Float(
        string="Opening Time Restriction",
        help="Allowed opening time (POS sessions can only start at or after this hour) (e.g. 8.00 = 8:00 AM) Format 24 hours."
    )
    closing_time_restriction = fields.Float(
        string="Closing Time Restriction",
        help="Allowed closing time (POS sessions can only close at or after this hour) (e.g. 22.00 = 10:00 PM) Format 24 hours."
    )

    def open_ui(self):
        self.ensure_one()
        tz_user = pytz.timezone(self.env.user.tz)
        utc_datetimenow = datetime.now()  
        user_datetimenow = utc_datetimenow.astimezone(tz_user)  

        opening_time_hours = int(self.opening_time_restriction)
        opening_time_minutes = round((self.opening_time_restriction - opening_time_hours) * 60)
        opening_time_restriction = user_datetimenow.replace(hour=opening_time_hours, minute=opening_time_minutes)


        closing_time_hours = int(self.closing_time_restriction)
        closing_time_minutes = round((self.closing_time_restriction - closing_time_hours) * 60)
        closing_time_restriction = user_datetimenow.replace(hour=closing_time_hours, minute=closing_time_minutes)

        # NEW SESSION
        if self.opening_time_restriction and self.opening_time_restriction > 0 and not self.current_session_id:
            if user_datetimenow < opening_time_restriction:
                raise UserError(_('Cannot create new session before '+str(opening_time_restriction.strftime("%H:%M"))+', because opening time restriction.'))


        res = super(POSConfig, self).open_ui()
        return res




class POSSession(models.Model):
    _inherit = 'pos.session'


    def _loader_params_res_users(self):
        res = super(POSSession, self)._loader_params_res_users()
        res['search_params']['fields'].append('tz')
        return res

