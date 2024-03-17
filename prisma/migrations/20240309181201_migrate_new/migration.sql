-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('Visa', 'MasterCard', 'AmericanExpress', 'Discover', 'Elo', 'DEFAULT');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Credit', 'Debit', 'Pix', 'Ticket');

-- CreateEnum
CREATE TYPE "AuctStatus" AS ENUM ('cataloged', 'live', 'canceld');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "admin_url_profile" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Moderator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "moderator_url_profile" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Moderator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Advertiser" (
    "id" TEXT NOT NULL,
    "nano_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "CNPJ" TEXT,
    "url_profile_cover" TEXT,
    "url_profile_company_logo_cover" TEXT,
    "company_adress" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

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
    "client_url_profile" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuctDateGroups" (
    "id" TEXT NOT NULL,
    "date_auct" TIMESTAMP(3) NOT NULL,
    "group" TEXT NOT NULL,
    "auctId" TEXT,

    CONSTRAINT "AuctDateGroups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auct" (
    "id" TEXT NOT NULL,
    "nano_id" TEXT,
    "categorie" TEXT,
    "advertiser_id" TEXT,
    "creator_id" TEXT NOT NULL,
    "winner_id" TEXT,
    "client_id" TEXT,
    "title" TEXT NOT NULL,
    "tags" TEXT[],
    "auct_cover_img" TEXT NOT NULL,
    "descriptions_informations" TEXT NOT NULL,
    "terms_conditions" TEXT NOT NULL,
    "limit_client" BOOLEAN NOT NULL,
    "limit_date" BOOLEAN NOT NULL,
    "accept_payment_methods" "PaymentMethod"[],
    "value" TEXT NOT NULL,
    "status" "AuctStatus" NOT NULL,
    "product_timer_seconds" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

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
    "admin_id" TEXT,
    "advertiser_id" TEXT,
    "client_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "auct_nanoid" TEXT,
    "advertiser_id" TEXT,
    "owner_id" TEXT,
    "group" TEXT,
    "auct_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "initial_value" INTEGER NOT NULL,
    "reserve_value" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "cover_img_url" TEXT,
    "group_imgs_url" TEXT[],
    "highlight_product" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "client_id" TEXT,
    "auct_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AuctToClient" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Moderator_email_key" ON "Moderator"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Advertiser_nano_id_key" ON "Advertiser"("nano_id");

-- CreateIndex
CREATE UNIQUE INDEX "Advertiser_email_key" ON "Advertiser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Auct_nano_id_key" ON "Auct"("nano_id");

-- CreateIndex
CREATE UNIQUE INDEX "_AuctToClient_AB_unique" ON "_AuctToClient"("A", "B");

-- CreateIndex
CREATE INDEX "_AuctToClient_B_index" ON "_AuctToClient"("B");

-- AddForeignKey
ALTER TABLE "AuctDateGroups" ADD CONSTRAINT "AuctDateGroups_auctId_fkey" FOREIGN KEY ("auctId") REFERENCES "Auct"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auct" ADD CONSTRAINT "Auct_advertiser_id_fkey" FOREIGN KEY ("advertiser_id") REFERENCES "Advertiser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_advertiser_id_fkey" FOREIGN KEY ("advertiser_id") REFERENCES "Advertiser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_advertiser_id_fkey" FOREIGN KEY ("advertiser_id") REFERENCES "Advertiser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_auct_id_fkey" FOREIGN KEY ("auct_id") REFERENCES "Auct"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_auct_id_fkey" FOREIGN KEY ("auct_id") REFERENCES "Auct"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuctToClient" ADD CONSTRAINT "_AuctToClient_A_fkey" FOREIGN KEY ("A") REFERENCES "Auct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuctToClient" ADD CONSTRAINT "_AuctToClient_B_fkey" FOREIGN KEY ("B") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
