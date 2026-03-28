--
-- PostgreSQL database dump
--

\restrict qvBZxdhCdYZf6KsLGnJbMYbwZvyJowbRRex1xAdfepBbze4fIcRW5Sdox5bOELk

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


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: stores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stores (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    "ownerId" character varying NOT NULL,
    address character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Data for Name: stores; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stores (id, name, "ownerId", address, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: stores PK_7aa6e7d71fa7acdd7ca43d7c9cb; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY (id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON SCHEMA public TO cloudsqlsuperuser;


--
-- PostgreSQL database dump complete
--

\unrestrict qvBZxdhCdYZf6KsLGnJbMYbwZvyJowbRRex1xAdfepBbze4fIcRW5Sdox5bOELk

