--
-- PostgreSQL database dump
--

\restrict fvI8yuL9nrknRT99LeB9y5M61OmJ8eNpbrqfYelddy7s1c762o5KJhQsVDD2Pdo

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: orders_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.orders_status_enum AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY_FOR_PICKUP',
    'COMPLETED',
    'CANCELLED'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" character varying NOT NULL,
    "storeId" character varying NOT NULL,
    items jsonb NOT NULL,
    "totalAmount" numeric(10,2) NOT NULL,
    status public.orders_status_enum DEFAULT 'PENDING'::public.orders_status_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "customerName" character varying,
    address text,
    phone character varying,
    "userEmail" character varying
);


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, "userId", "storeId", items, "totalAmount", status, "createdAt", "updatedAt", "customerName", address, phone, "userEmail") FROM stdin;
ba85d630-ad34-4807-bb28-e20e667744f4	user-123	store-1	[{"name": "Chicken Breast", "price": 6, "quantity": 300, "menuItemId": "1"}, {"name": "Mixed Greens", "price": 3, "quantity": 200, "menuItemId": "2"}, {"name": "Cherry Tomatoes", "price": 2, "quantity": 100, "menuItemId": "3"}]	2808.00	PENDING	2025-12-29 16:58:24.690289	2025-12-29 16:58:24.690289	\N	\N	\N	\N
7a38c5be-4e51-4304-914d-a0629f8a6ab0	user-123	store-1	[{"name": "Broccoli", "price": 2, "quantity": 200, "menuItemId": "1"}]	432.00	PENDING	2025-12-30 15:22:52.079583	2025-12-30 15:22:52.079583	\N	\N	\N	\N
508bbf7b-b412-46ba-b3e2-0c2a912b9fad	user-123	store-1	[{"name": "2 cup rice", "price": 0, "quantity": 2, "menuItemId": "1"}, {"name": "2 tomatoes", "price": 0, "quantity": 2, "menuItemId": "2"}, {"name": "2 onion", "price": 0, "quantity": 2, "menuItemId": "3"}]	5.99	PENDING	2026-01-05 09:07:03.315306	2026-01-05 09:07:03.315306	\N	\N	\N	\N
d9c76ba6-cdd7-41a4-8f88-a600ab617556	user-123	store-1	[{"name": "Chicken Momo - L", "price": 350, "quantity": 1, "menuItemId": "4"}]	378.00	PENDING	2026-03-21 12:05:46.574808	2026-03-21 12:05:46.574808	Guest User	123, Green Street, Blue Crate Apartments, Indiranagar, Bangalore - 560038	9876543210	guest@example.com
3d8f2c1a-e553-49c6-a2c2-137c3b77f9aa	user-123	store-1	[{"name": "Chicken Momo - L", "price": 350, "quantity": 1, "menuItemId": "4"}]	378.00	PENDING	2026-03-21 12:32:43.25625	2026-03-21 12:32:43.25625	Guest User	123, Green Street, Blue Crate Apartments, Indiranagar, Bangalore - 560038	9876543210	guest@example.com
2d78a9f0-0177-4d35-8e12-44d8309f28bf	user-123	store-1	[{"name": "Chicken Momo - L", "price": 350, "quantity": 1, "menuItemId": "4"}]	378.00	PENDING	2026-03-21 12:32:43.345246	2026-03-21 12:32:43.345246	Guest User	123, Green Street, Blue Crate Apartments, Indiranagar, Bangalore - 560038	9876543210	guest@example.com
859b34d7-cd0e-43a0-97be-103e32b040de	user-123	store-123	[{"name": "Test Burger", "price": 25, "quantity": 2, "menuItemId": "item-001"}]	50.00	CANCELLED	2025-12-29 16:55:24.260698	2026-03-22 19:03:28.787355	\N	\N	\N	\N
4973a818-f8b8-4d50-bbc7-804b16e68119	user-123	store-1	[{"name": "Chicken Momo - L", "price": 350, "quantity": 50, "menuItemId": "4"}]	18900.00	PENDING	2026-03-22 19:04:37.62395	2026-03-22 19:04:37.62395	Guest User	123, Green Street, Blue Crate Apartments, Indiranagar, Bangalore - 560038	9876543210	guest@example.com
d1543824-91ad-4b28-b8e3-338796d86499	user-123	store-1	[{"name": "Chicken Momo - L", "price": 350, "quantity": 2, "menuItemId": "4"}]	756.00	PENDING	2026-03-22 19:54:37.578963	2026-03-22 19:54:37.578963	Guest User	123, Green Street, Blue Crate Apartments, Indiranagar, Bangalore - 560038	9876543210	guest@example.com
f71728ef-b0ef-4294-ae9e-854b58416caa	user-123	store-1	[{"name": "Chicken Momo - L", "price": 350, "quantity": 1, "menuItemId": "4"}]	378.00	PENDING	2026-03-24 09:06:08.113043	2026-03-24 09:06:08.113043	Guest User	123, Green Street, Blue Crate Apartments, Indiranagar, Bangalore - 560038	9876543210	guest@example.com
\.


--
-- Name: orders PK_710e2d4957aa5878dfe94e4ac2f; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY (id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON SCHEMA public TO cloudsqlsuperuser;


--
-- PostgreSQL database dump complete
--

\unrestrict fvI8yuL9nrknRT99LeB9y5M61OmJ8eNpbrqfYelddy7s1c762o5KJhQsVDD2Pdo

