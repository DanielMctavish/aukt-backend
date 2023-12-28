-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('Visa', 'MasterCard', 'AmericanExpress', 'Discover', 'Elo', 'DEFAULT');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Credit', 'Debit', 'Pix', 'Ticket');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "creditCardId" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Advertiser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "creditCardId" TEXT NOT NULL,

    CONSTRAINT "Advertiser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "creditCardId" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auct" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tags" TEXT[],
    "auct_cover_img" TEXT NOT NULL,
    "csv_list" TEXT NOT NULL,
    "descriptions_informations" TEXT NOT NULL,
    "terms_conditions" TEXT NOT NULL,
    "auct_date" TIMESTAMP(3)[],
    "limit_client" BOOLEAN NOT NULL,
    "limit_date" BOOLEAN NOT NULL,
    "accept_payment_methods" "PaymentMethod" NOT NULL,
    "value" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Auct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditCard" (
    "id" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "cardHolderName" TEXT NOT NULL,
    "expirationDate" TEXT NOT NULL,
    "cvv" TEXT NOT NULL,
    "cardType" "CardType" NOT NULL,
    "adminId" TEXT,
    "advertiserId" TEXT,
    "clientId" TEXT,

    CONSTRAINT "CreditCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "initial_value" INTEGER NOT NULL,
    "final_value" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "width" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "cover_img_url" TEXT NOT NULL,
    "img01_url" TEXT NOT NULL,
    "img02_url" TEXT NOT NULL,
    "img03_url" TEXT NOT NULL,
    "img04_url" TEXT NOT NULL,
    "img05_url" TEXT NOT NULL,
    "img06_url" TEXT NOT NULL,
    "highlight_product" BOOLEAN NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AuctToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AuctToProduct_AB_unique" ON "_AuctToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_AuctToProduct_B_index" ON "_AuctToProduct"("B");

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_advertiserId_fkey" FOREIGN KEY ("advertiserId") REFERENCES "Advertiser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuctToProduct" ADD CONSTRAINT "_AuctToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Auct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuctToProduct" ADD CONSTRAINT "_AuctToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
