import IBid from "../../entities/IBid";
import PrismaBidRepositorie from "../../repositorie/database/PrismaBidRepositorie";

const prismaBids = new PrismaBidRepositorie();

const AuctionInspector = async (bids: IBid[]): Promise<void> => {
    try {

        const bidsByValue = bids.reduce((acc, bid) => {
            if (!acc[bid.value]) {
                acc[bid.value] = [];
            }
            acc[bid.value].push(bid);
            return acc;
        }, {} as { [key: number]: IBid[] });


        for (const value in bidsByValue) {
            const sameBids = bidsByValue[value];

            if (sameBids.length > 1) {

                sameBids.sort((a, b) =>
                    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                );

                const [oldestBid, ...duplicateBids] = sameBids;

                console.log(`Valor ${value}:`);
                console.log(`- Mantendo lance de ${new Date(oldestBid.created_at).toISOString()} (ID: ${oldestBid.id})`);

                for (const bid of duplicateBids) {
                    console.log(`- Excluindo lance duplicado de ${new Date(bid.created_at).toISOString()} (ID: ${bid.id})`);
                    await prismaBids.DeleteBid(bid.id);
                }
            }
            
        }
    } catch (error) {
        console.error("Erro ao inspecionar lances:", error);
        throw error;
    }
};

export default AuctionInspector;