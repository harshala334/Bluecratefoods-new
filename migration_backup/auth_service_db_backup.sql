--
-- PostgreSQL database dump
--

\restrict 5wKaRSQ8C0U18ShY0ky1XseTK4koVFdVQhWPR0pX6FbkIhtxhvavmJ4C9viyjiC

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
-- Name: users_creatorstatus_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.users_creatorstatus_enum AS ENUM (
    'none',
    'pending',
    'verified',
    'rejected'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    bio character varying,
    "profileImage" character varying,
    "backgroundImage" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "isVerifiedCreator" boolean DEFAULT false NOT NULL,
    "creatorStatus" public.users_creatorstatus_enum DEFAULT 'none'::public.users_creatorstatus_enum NOT NULL,
    "userType" character varying DEFAULT 'individual'::character varying NOT NULL,
    "creatorApplicationReason" character varying,
    "creatorSocialLinks" jsonb DEFAULT '[]'::jsonb NOT NULL,
    "vendorCategory" character varying
);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password, bio, "profileImage", "backgroundImage", "createdAt", "updatedAt", "isVerifiedCreator", "creatorStatus", "userType", "creatorApplicationReason", "creatorSocialLinks", "vendorCategory") FROM stdin;
c73b202a-bec3-4b55-841f-b60f631c3995	Dummy User	dummy@bluecratefoods.com	$2b$10$Xij0NHi3mQnndsddz2yxaecfSyoyt6nwsN2qnHERd5lTYt3vH1XXO	\N	\N	\N	2025-12-29 06:40:41.984661	2025-12-29 06:40:41.984661	f	none	individual	\N	[]	\N
d4670132-7109-44c6-9d8c-5da78f883652	Harshala	test2@test.com	$2b$10$zq6GxG7u0KEXfX9BbWrGTefPbhj3zTP0xfjaUR3ZMqIRf2.3ELybS	\N	\N	\N	2025-12-29 10:24:10.804261	2025-12-29 10:24:10.804261	f	none	individual	\N	[]	\N
ad182c2b-e0f8-4a19-bc92-9e6e5f769873	Jayesh 	jayeshmahajan625@gmail.com	$2b$10$1okULVkzF2boGaz6FvDmG.KRpXnFVOuxwOTi.rhxmhEekwBfId9X.	\N	\N	\N	2026-01-02 15:21:20.656236	2026-01-02 15:21:20.656236	f	none	individual	\N	[]	\N
ca0e0d35-655f-49c4-a485-cea25435c980	Soumik	Soumikmajumdar89@gmail.com	$2b$10$CwBk/10UWr3l5n.XPS3Bu.CrVMdAIour18SkJVE2tQK3299DLHvk2	\N	\N	\N	2026-01-03 05:05:29.841511	2026-01-03 05:05:29.841511	f	none	individual	\N	[]	\N
ec1e430b-a2b6-4d89-b7a9-4cc1f795a7e0	Hemang Kulkarni 	hemangrk@gmail.com	$2b$10$qNjK3hCQXjMLnPe0bWL3L.6J/M3anMDz8mASmUnjc5MoS/S9fWvwy	\N	\N	\N	2026-01-03 05:18:37.163548	2026-01-03 05:18:37.163548	f	none	individual	\N	[]	\N
327b581e-8a89-4409-8f47-6d8da57bd3e4	zakhkc	crawlerrobo@gmail.com	$2b$10$fcJKnXS4VzUcD0hqJN.t/Okdpfl/M5MFTxp35IwstTHefQh4m0EeO	\N	\N	\N	2026-01-03 09:02:48.369154	2026-01-03 09:02:48.369154	f	none	individual	\N	[]	\N
6bde2115-26fe-44cc-adac-668b99e4683b	admin	admin@gmail.com	$2b$10$h5Dv8z.vcJLvz24J9w.f0ekHV6SaIXeIow63npYxMbwl4UToZxnIe	\N	\N	\N	2026-01-05 10:41:05.19862	2026-03-28 06:37:49.176247	t	verified	admin	\N	[]	\N
40cde23a-ba20-4dfa-a653-dc65e3f045e2	Packaging Vendor	vendor@bluecrate.com	$2b$10$DzwnnOcvx6NK9ZOQN0NVyeXatjn.F8MVxaEosMrks8zKwUbVffiUy	\N	\N	\N	2026-03-18 05:04:53.242881	2026-03-28 12:20:58.479776	f	none	vendor	\N	[]	packaging
3ee350ff-6331-428e-8bcb-e521493e59cb	Kavita 	kavita@gmail.com	$2b$10$WqUys24WbNTNm1bctxM7lOTvpACokxOxtYC6CiU0sr5MyXDAGY8Wy	\N	\N	\N	2026-01-05 12:00:51.297835	2026-01-05 12:53:14.859362	t	verified	individual	Sample	["ndndbd.com"]	\N
670334f0-1b83-430a-a6d1-2a427ecc4169	Harshala	mharshala334@gmail.com	$2b$10$KXa3rF8fEqFvG/7lZnHrvejahwNI2h.duPyPNtYHQRSZKWWeqAfty	\N	\N	\N	2025-12-30 17:55:39.88532	2026-01-05 13:05:45.67134	f	rejected	individual	Sample	["bluecratefoods.com"]	\N
\.


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON SCHEMA public TO cloudsqlsuperuser;


--
-- PostgreSQL database dump complete
--

\unrestrict 5wKaRSQ8C0U18ShY0ky1XseTK4koVFdVQhWPR0pX6FbkIhtxhvavmJ4C9viyjiC

