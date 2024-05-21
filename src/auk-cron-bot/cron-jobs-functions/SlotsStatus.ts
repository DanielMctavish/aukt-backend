import { IFloorAuction } from "../interfaces/IBotResponses";
import { cronmarker } from "../AukCronBot";

class SlotsStatus {

    selectSlotAvailable(floorAuction: IFloorAuction) {
        let slotMarked = false


        return new Promise(async (resolve, reject) => {

            const foundedSlot = cronmarker.allSlots.findIndex(slot => slot.auct_id === floorAuction.auct_id);

            if (foundedSlot !== -1) {
                cronmarker.allSlots[foundedSlot] = floorAuction;
            } else {
                cronmarker.allSlots.forEach((slot, index) => {
                    if (slotMarked) return false
                    if (slot === false) {

                        cronmarker.allSlots[index] = floorAuction;
                        slotMarked = true;

                    }
                })
            }

            resolve(true)
        });

    }


    show() {
        return new Promise((resolve) => {

            console.log('--------------------------------- SLOTS ----------------------------------');
            cronmarker.allSlots.forEach((slot) => {
                console.log(slot)
            })
            resolve(true)

        })
    }

}

export default SlotsStatus;
