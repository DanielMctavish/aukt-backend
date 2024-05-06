import { cronmarker } from "../AukCronBot";

const SlotsStatus = () => {

    console.log('--------------------------------- SLOTS ----------------------------------');
    console.log('\x1b[36m%s\x1b[0m', 'SLOT 01:', cronmarker.slotAuct01?.title ? true : false);
    console.log('\x1b[36m%s\x1b[0m', 'SLOT 03:', cronmarker.slotAuct03?.title ? true : false);
    console.log('\x1b[36m%s\x1b[0m', 'SLOT 04:', cronmarker.slotAuct04?.title ? true : false);
    console.log('\x1b[36m%s\x1b[0m', 'SLOT 05:', cronmarker.slotAuct05?.title ? true : false);
    console.log('\x1b[36m%s\x1b[0m', 'SLOT 06:', cronmarker.slotAuct06?.title ? true : false);

}

export default SlotsStatus;