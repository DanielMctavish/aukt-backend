import { IFloorAuction } from "../interfaces/IBotResponses";
import { cronmarker } from "../AukCronBot";

class SlotsStatus {

    selectSlotAvailable(floorAuction: IFloorAuction) {
        return new Promise((resolve, reject) => {
            let slotFound = false;
    
            cronmarker.allSlots.forEach((slot, index) => {
                if (slotFound) return;
    
                if (slot.SLOT && slot.SLOT.auct_id === floorAuction.auct_id) {
                    cronmarker.allSlots[index].SLOT = floorAuction;
                    slotFound = true;
                }
    
                if (!slot.SLOT) {
                    cronmarker.allSlots[index].SLOT = floorAuction;
                    slotFound = true;
                }
            });
    
            if (slotFound) {
                resolve(cronmarker.allSlots);
            } else {
                reject('No available slot found');
            }
        });
    }
    

    show() {
        return new Promise((resolve) => {

            console.log('--------------------------------- SLOTS ----------------------------------');
            cronmarker.allSlots.forEach((slot) => {
                console.log(slot)
            })
            resolve('slots showed')

        })
    }

}

export default SlotsStatus;
