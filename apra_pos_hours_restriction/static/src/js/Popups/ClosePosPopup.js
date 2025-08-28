odoo.define('apra_pos_hours_restriction.ClosePosPopup', function (require) {
    'use strict';

    const ClosePosPopup = require('point_of_sale.ClosePosPopup');
    const Registries = require('point_of_sale.Registries');
    const { useBus } = require('@web/core/utils/hooks');
    const { useListener } = require("@web/core/utils/hooks");

    const InheritClosePosPopup = (ClosePosPopup) =>
        class extends ClosePosPopup {

            FloatToTodayDatetime(closing_time_restriction) {
                var tz = this.env.pos.user.tz
                let datetime_now_str = new Date().toLocaleString("en-US", { timeZone: tz });
                let now = new Date(datetime_now_str);
                const hours = Math.floor(closing_time_restriction);
                const minutes = Math.round((closing_time_restriction - hours) * 60);

                now.setHours(hours);
                now.setMinutes(minutes);
                now.setSeconds(0);
                now.setMilliseconds(0);

                return now;
            }

            canCancel() {
            	var res = super.canCancel()
            	var tz = this.env.pos.user.tz
                let datetime_now_str = new Date().toLocaleString("en-US", { timeZone: tz });
                let datetime_now = new Date(datetime_now_str);
                
                if(this.env.pos.config.closing_time_restriction && this.env.pos.config.closing_time_restriction > 0){
                	res = false
                }
	            return res;
	        }

        }
    Registries.Component.extend(ClosePosPopup, InheritClosePosPopup);

    return InheritClosePosPopup;
});
