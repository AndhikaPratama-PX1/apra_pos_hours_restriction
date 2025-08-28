odoo.define('apra_pos_hours_restriction.HeaderButton', function (require) {
    'use strict';

    const HeaderButton = require('point_of_sale.HeaderButton');
    const Registries = require('point_of_sale.Registries');
    const { useBus } = require('@web/core/utils/hooks');
    const { useListener } = require("@web/core/utils/hooks");

    const InheritHeaderButton = (HeaderButton) =>
        class extends HeaderButton {

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

            setup() {
                super.setup();
                this.env.bus.on('trigger_close_restriction', this, () => {
                    this.onClick();
                });
            }


            onClick() {
                var tz = this.env.pos.user.tz
                let datetime_now_str = new Date().toLocaleString("en-US", { timeZone: tz });
                let datetime_now = new Date(datetime_now_str);
                
                if(this.env.pos.config.closing_time_restriction && this.env.pos.config.closing_time_restriction > 0){
                    const closing_time_restriction = this.FloatToTodayDatetime(this.env.pos.config.closing_time_restriction);
                    if(datetime_now < closing_time_restriction ){
                        let hh = closing_time_restriction.getHours().toString().padStart(2, "0");
                        let mm = closing_time_restriction.getMinutes().toString().padStart(2, "0");
                        var showtime = `${hh}:${mm}`
                        this.showPopup('ErrorPopup', {
                            title: this.env._t('Closing Time Restriction'),
                            body: this.env._t('Cannot close session before '+showtime+', because closing time restriction')
                        });
                        return
                    }
                }
                super.onClick()
            
            }
        }
    Registries.Component.extend(HeaderButton, InheritHeaderButton);

    return InheritHeaderButton;
});
