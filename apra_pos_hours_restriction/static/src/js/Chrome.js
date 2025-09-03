odoo.define('apra_pos_hours_restriction.Chrome', function (require) {
    'use strict';

    const Chrome = require('point_of_sale.Chrome');
    const Registries = require('point_of_sale.Registries');
    const HeaderButton = require('apra_pos_hours_restriction.HeaderButton');
    const framework = require('web.framework');

    const InheritChrome = (Chrome) =>
        class extends Chrome {

            FloatToTodayDatetime(closing_time_restriction) {
                var tz = odoo.session_info.user_context.tz
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

            
            async CheckingClosingTime(){
                let self = this
                var tz = odoo.session_info.user_context.tz
                let datetime_now_str = new Date().toLocaleString("en-US", { timeZone: tz });
                let datetime_now = new Date(datetime_now_str);
                const closing_time_restriction = this.FloatToTodayDatetime(this.env.pos.config.closing_time_restriction);
                if(datetime_now > closing_time_restriction){

                    self.env.pos.is_closing_time_restriction = true
                    let hh = closing_time_restriction.getHours().toString().padStart(2, "0");
                    let mm = closing_time_restriction.getMinutes().toString().padStart(2, "0");
                    var showtime = `${hh}:${mm}`

                    const $ctr_popup = `
                        <div class="ctr_popup" style="
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0,0,0,0.5);
                            z-index: 9999;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">
                            <div class="ctr_popup1" style="
                                background: #dd6262; 
                                color: white;
                                border: 2px solid #444;
                                padding: 20px 30px;
                                border-radius: 10px;
                                box-shadow: 0 5px 20px rgba(0,0,0,0.4);
                                font-size: 20px;
                                text-align: center;
                                width: 50%;
                            ">
                                <p class="text-center"><b>Closing Time Restriction</b></p>
                                <hr/>
                                <p style="font-size: 16px;">Cannot continue this session after <b>`+showtime+`</b>, because closing time restriction. Please confirm to close session.
                                </p>
                                <button class="button btn btn-primary" style="
                                    font-size: 16px;
                                    padding: 6px 14px;
                                    background: #b13e3e;
                                    color: white;
                                    border: 1px solid white;
                                    font-weight: bolder;
                                    margin-top: 15px;
                                    cursor: pointer;
                                ">
                                    Confirm
                                </button>
                            </div>
                        </div>
                    `;
                    $('body .pos').append($ctr_popup);
                    $(".ctr_popup .btn").on("click", function() {
                        $(".ctr_popup").remove()
                        self.env.bus.trigger('trigger_close_restriction');
                        self.env.bus.trigger('trigger_close_restriction');
                        framework.blockUI();
                    })
                }
                if(!self.env.pos.is_closing_time_restriction){
                    setTimeout(async () => {
                        await self.CheckingClosingTime()
                    }, 3000)
                }
            }
            async start() {
                var self = this;
                await super.start();
                if(this.env.pos.config.closing_time_restriction && this.env.pos.config.closing_time_restriction > 0){
                    setTimeout(async () => {
                        await self.CheckingClosingTime()
                    }, 3000)
                }
                
            }

        }
    Registries.Component.extend(Chrome, InheritChrome);

    return InheritChrome;
});