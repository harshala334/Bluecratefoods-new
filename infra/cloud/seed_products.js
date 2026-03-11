const { Client } = require('pg');

const config = {
    host: '136.114.139.164',
    user: 'bluecrate',
    password: 'bluecratepass',
    database: 'bluecrate_db',
    port: 5432,
};

const rawData = `BCF-01-A-001	Chicken Mini Momo	Frozen	Momo	Chicken Momo	frozen, 5 min meals	S	10-12 gms	3.75	50	188
BCF-01-A-002	Chicken Mini Momo	Frozen	Momo	Chicken Momo	frozen, 5 min meals	XS	14-15 gms	4.5	50	225
BCF-01-A-003	Chicken Momo	Frozen	Momo	Chicken Momo	frozen, 5 min meals	M	22-23 gms	5.5	50	275
BCF-01-A-004	Chicken Momo	Frozen	Momo	Chicken Momo	frozen, 5 min meals	L	27-28 gms	7	50	350
BCF-01-A-005	Chicken Darjeeling Momo	Frozen	Momo	Chicken Momo	frozen, 5 min meals	M	22-23 gms	6	50	300
BCF-01-A-006	Chicken Darjeeling Momo	Frozen	Momo	Chicken Momo	frozen, 5 min meals	L	27-28 gms	7.5	50	375
BCF-01-A-007	Chicken Gondhoraj Momo	Frozen	Momo	Chicken Momo	frozen, 5 min meals	M	22-23 gms	7	50	350
BCF-01-A-008	Chicken Gondhoraj Momo	Frozen	Momo	Chicken Momo	frozen, 5 min meals	L	27-28 gms	8.5	50	425
BCF-01-A-009	Chicken Cheese Momo	Frozen	Momo	Chicken Momo	frozen, 5 min meals	M	22-23 gms	8	50	400
BCF-01-A-010	Chicken Cheese Momo	Frozen	Momo	Chicken Momo	frozen, 5 min meals	L	27-28 gms	9.5	50	475
BCF-01-A-011	Chicken Tandoori Momo	Frozen	Momo	Chicken Momo	frozen, 5 min meals	L	27-28 gms	8.5	50	425
BCF-01-A-012	Chicken Chilli Ginger Momo	Frozen	Momo	Chicken Momo	frozen, 5 min meals	L	27-28 gms	8.5	50	425
BCF-01-A-013	Chicken Chinese Chilli Momo	Frozen.	Momo	Chicken Momo	frozen, 5 min meals	L	27-28 gms	8.5	50	425
BCF-01-B-001	Fish Gondhoraj Momo	Frozen	Momo	Seafood Momo	frozen, 5 min meals	M	22-23 gms	9.5	50	475
BCF-01-B-002	Fish Gondhoraj Momo	Frozen	Momo	Seafood Momo	frozen, 5 min meals	L	27-28 gms	11	50	550
BCF-01-B-003	Prawn Momo	Frozen	Momo	Seafood Momo	frozen, 5 min meals	M	22-23 gms	10	50	500
BCF-01-B-004	Prawn Momo	Frozen	Momo	Seafood Momo	frozen, 5 min meals	L	27-28 gms	11.5	50	575
BCF-01-C-001	Veg Mini Momo	Frozen	Momo	Veg Momo	frozen, 5 min meals	XS	10-12 gms	3.25	50	163
BCF-01-C-002	Veg Mini Momo	Frozen	Momo	Veg Momo	frozen, 5 min meals	S	14-15 gms	4	50	200
BCF-01-C-003	Veg Momo	Frozen	Momo	Veg Momo	frozen, 5 min meals	M	22-23 gms	5	50	250
BCF-01-C-004	Veg Momo	Frozen	Momo	Veg Momo	frozen, 5 min meals	L	27-28 gms	6.5	50	325
BCF-01-C-005	Paneer Corn Momo	Frozen	Momo	Veg Momo	frozen, 5 min meals	M	22-23 gms	7.5	50	375
BCF-01-C-006	Paneer Corn Momo	Frozen	Momo	Veg Momo	frozen, 5 min meals	L	27-28 gms	9	50	450
BCF-01-C-007	Corn Cheese Momo	Frozen	Momo	Veg Momo	frozen, 5 min meals	M	22-23 gms	8	50	400
BCF-01-C-008	Corn Cheese Momo	Frozen	Momo	Veg Momo	frozen, 5 min meals	L	27-28 gms	9.5	50	475
BCF-01-C-009	Mushroom Momo	Frozen	Momo	Veg Momo	frozen, 5 min meals	M	22-23 gms	8	50	400
BCF-01-C-010	Mushroom Momo	Frozen	Momo	Veg Momo	frozen, 5 min meals	L	27-28 gms	9.5	50	475
BCF-01-D-001	Chicken Shaphaley	Frozen	Momo	Sha-Phaley Momo	frozen, 5 min meals	XL	36-38 gms	16	50	800
BCF-01-D-002	Veg Shaphaley	Frozen	Momo	Sha-Phaley Momo	frozen, 5 min meals	XL	36-38 gms	14	50	700
BCF-02-A-001	Fish Fry - Red Snapper	Frozen	Fried Items	Fried Items-Fish	frozen, 5 min meals	M	85-90 gms	54	10	540
BCF-02-A-002	Fish Fry-Red Snapper	Frozen	Fried Items	Fried Items- Fish	frozen, 5 min meals	L	105-110 gms	68	10	680
BCF-02-A-003	Fish Fry-Kol Bhetki	Frozen	Fried Items	Fried Items- Fish	frozen, 5 min meals	M	85-90 gms	84	10	840
BCF-02-A-004	Fish Fry - Kol Bhetki	Frozen	Fried Items	Fried Items- Fish	frozen, 5 min meals	L	105-110 gms	98	10	980
BCF-02-A-005	Fish Fry- Bom Bhetki	Frozen	Fried Items	Fried Items- Fish	frozen, 5 min meals	M	85-90 gms	74	10	740
BCF-02-A-006	Fish Fry-Bom Bhetki	Frozen	Fried Items	Fried Items- Fish	frozen, 5 min meals	L	105-110 gms	88	10	880
BCF-02-A-007	Fish Fry-Basa	Frozen	Fried Items	Fried Items- Fish	frozen, 5 min meals	M	85-90 gms	48	10	480
BCF-02-A-008	Fish Fry-Basa	Frozen	Fried Items	Fried Items- Fish	frozen, 5 min meals	L	105-110 gms	62	10	620
BCF-02-A-009	Fish Finger - Red Snapper	Frozen	Fried Items	Fried Items- Fish	frozen, 5 min meals	M	27-30 gms	19	20	380
BCF-02-A-010	Fish Finger - Red Snapper	Frozen	Fried Items	Fried Items- Fish	frozen, 5 min meals	L	35-38 gms	22	20	440
BCF-02-A-011	Fish Finger - Kol Bhetki	Frozen	Fried Items	Fried Items- Fish	frozen, 5 min meals	M	27-30 gms	32	20	640
BCF-02-A-012	Fish Finger - Kol Bhetki	Frozen	Fried Items	Fried Items-Fish	frozen, 5 min meals	L	35-38 gms	36	20	720
BCF-02-A-013	Fish Finger - Basa	Frozen	Fried Items	Fried Items- Fish	frozen, 5 min meals	M	27-30 gms.	17	20	340
BCF-02-A-014	Fish Finger - Basa	Frozen	Fried Items	Fried Items- Fish	frozen, 5 min meals	L	35-38 gms	20	20	400
BCF-02-A-015	Fish Ball	Frozen	Fried Items	Fried Items- Fish	frozen, 5 min meals	-	22-24 gms	18	40	720
BCF-02-A-016	Fish Chop	Frozen.	Fried Items	Fried Items- Fish	frozen, 5 min meals	-	25-27 gms	25	30	750
BCF-02-A-017	Fish Pops	Frozen	Fried Items	Fried Items- Fish	frozen, 5 min meals	-	1 kg pack	460	-	285
BCF-02-A-018	Golden Prawn	Frozen	Fried Items	Fried Items- Fish	frozen, 5 min meals	-	32-36 gms	21	30	630
BCF-02-A-019	Golden Prawn	Frozen	Fried Items	Fried Items- Fish	frozen, 5 min meals	-	58-60 gms	32	20	640
BCF-02-A-020	Calamari Rings	Frozen	Fried Items	Fried Items- Fish	frozen, 5 min meals	-	500 gms pack	390	-	285
BCF-02-A-021	Prawn Pockets	Frozen	Fried Items	Fried Items- Fish	frozen, 5 min meals	-	32-35 gms	28	30	840
BCF-02-A-022	Tilapia Nuggets	Frozen	Fried Items	Fried Items- Fish	frozen, 5 min meals	-	500 gms pack	380	-	285
BCF-02-A-023	Fish Spring Roll	Frozen	Fried Items	Fried Items-Fish	frozen, 5 min meals	-	65-70 gms	26	20	520
BCF-02-B-001	Chicken Cutlet	Frozen	Fried Items	Fried Items-Chicken	frozen, 5 min meals	M	34-37 gms	18	30	540
BCF-02-B-002	Chicken Cutlet	Frozen	Fried Items	Fried Items- Chicken	frozen, 5 min meals	L	54-56 gms	32	20	640
BCF-02-B-003	Chicken Burger Crunchy Patty - Basil Oregano	Frozen	Fried Items	Fried Items- Chicken	frozen, 5 min meals	M	40-44 gms	14	20	280
BCF-02-B-004	Chicken Burger Crunchy Patty - BBQ	Frozen	Fried Items	Fried Items- Chicken	frozen, 5 min meals	M	40-44 grms	13	20	260
BCF-02-B-005	Chicken Burger Crunchy Patty - Basil Oregano	Frozen	Fried Items	Fried Items- Chicken	frozen, 5 min meals	L	55-58 gms	20	20	400
BCF-02-B-006	Chicken Burger Crunchy Patty - BBQ	Frozen	Fried Items	Fried Items-Chicken	frozen, 5 min meals	L	55-58 gms	19	20	380
BCF-02-B-007	Chicken Ball	Frozen	Fried Items	Fried Items- Chicken	frozen, 5 min meals	-	34-37 gms	13	40	520
BCF-02-B-008	Chicken Cheeseball	Frozen	Fried Items	Fried Items- Chicken	frozen, 5 min meals	-	34-37 gms	15	40	600
BCF-02-B-009	Chicken Pakoda - Andhra (with bone)	Frozen	Fried Items	Fried Items-Chicken	frozen, 5 min meals	-	80-85 grms	16	20	320
BCF-02-B-010	Chicken Pakoda - Kolkata (boneless)	Frozen	Fried Items	Fried Items- Chicken	frozen, 5 min meals	-	65-70 gms	14	20	280
BCF-02-B-011	Chicken Nuggets	Frozen	Fried Items	Fried Items- Chicken	frozen, 5 min meals	-	1 kg pack	285	-	285
BCF-02-B-012	Chicken Pops	Frozen	Fried Items	Fried Items-Chicken	frozen, 5 min meals	-	1 kg pack	290	-	290
BCF-02-B-013	Chicken Wings - Crunchy	Frozen	Fried Items	Fried Items-Chicken	frozen, 5 min meals	-	12 pc pack	195	-	195
BCF-02-B-014	Chicken Wings - Marinated(with skin)	Frozen	Fried Items	Fried Items- Chicken	frozen, 5 min meals	-	12 pc pack	185	-	185
BCF-02-B-015	Chicken Strips	Frozen	Fried Items	Fried Items- Chicken	frozen, 5 min meals	M	20-22 grms	12	20	240
BCF-02-B-016	Chicken Strips	Frozen	Fried Items	Fried Items- Chicken	frozen, 5 min meals	L	28-30 gms	16	20	320
BCF-02-B-017	Chicken Samosa	Frozen	Fried Items	Fried Items-Chicken	frozen, 5 min meals	M	28-30 gms	12	30	360
BCF-02-B-018	Chicken Samosa	Frozen	Fried Items	Fried Items- Chicken	frozen, 5 min meals	L	40-44 gms	16	30	480
BCF-02-B-019	Chicken Spring Roll	Frozen	Fried Items	Fried Items- Chicken	frozen, 5 min meals	S	45-50 gms	14	30	420
BCF-02-B-020	Chicken Spring Roll	Frozen	Fried Items	Fried Items-Chicken	frozen, 5 min meals	M	65-70 grms	19	20	380
BCF-02-C-001	Paneer Cutlet	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	M	53-56 gms	24	20	480
BCF-02-C-002	Paneer Cutlet	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	L	73-76 gms	38	20	760
BCF-02-C-003	Paneer Finger	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	M	27-30 gms	9	30	270
BCF-02-C-004	Paneer Finger	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	L	35-38 gms	12	30	360
BCF-02-C-005	Veg Cheeseball	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	M	16-18 gms	11	40	440
BCF-02-C-006	Veg Cheeseball	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	L	28-30 gms	14	40	560
BCF-02-C-007	Veg Burger Patty	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	M	40-44 gms	11	30	330
BCF-02-C-008	Veg Burger Patty	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	L	55-58 gms	13	30	390
BCF-02-C-009	Aloo Tikki	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	L	40-44 gms	10	30	300
BCF-02-C-010	Samosa Bengali Fulgobi	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	M	28-30 gms	9	30	270
BCF-02-C-011	Samosa Bengali Fulgobi	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	L	40-44 gms	12	30	360
BCF-02-C-012	Samosa Punjabi Masala	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	M	28-30 gms	10	30	300
BCF-02-C-013	Samosa-Corn Cheese	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	M	28-30 gms	12	30	360
BCF-02-C-014	Samosa - Matar Paneer	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	M	28-30 gms	12	30	360
BCF-02-C-015	Soya Chaap	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	-	65-70 gms	21	30	630
BCF-02-C-016	Veg Spring Roll	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	M	45-50 gms	11	30	330
BCF-02-C-017	Veg Spring Roll	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	L	65-70 gms	14	20	280
BCF-02-C-018	Classic Aloo Vada (Vada Pav)	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	-	28-30 gms	11	30	330
BCF-02-C-019	Hara Bhara Kebab	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	-	18-21 gms	8	30	240
BCF-02-C-020	Falafel	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	-	38-40 gms	22	30	660
BCF-02-C-021	Cheese Corn Nuggets	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	-	1 kg pack	395	-	395
BCF-02-C-022	Potato Garlic Poppers	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	-	1 kg pack	230	-	230
BCF-02-C-023	Cheese Jalapeno Poppers	Frozen	Fried Items	Fried Items- Veg	frozen, 5 min meals	-	1 kg pack	385	-	385
BCF-03-A-001	Chicken Kebab - Tikka	Frozen	Multi-use Meat	Kebab/Grills	frozen, 10 min meals	-	22-24 gms	16	24	384
BCF-03-A-002	Chicken Kebab - Reshmi	Frozen	Multi-use Meat	Kebab/Grills	frozen, 10 min meals	-	22-24 gms	18	24	432
BCF-03-A-003	Chicken Kebab - Hariyali	Frozen	Multi-use Meat	Kebab/Grills	frozen, 10 min meals	-	22-24 gms	17	24	408
BCF-03-A-004	Chicken Kebab - Banjara	Frozen	Multi-use Meat	Kebab/Grills	frozen, 10 min meals	-	22-24 grms	17	24	408
BCF-03-A-005	Chicken Kebab - Malai	Frozen	Multi-use Meat	Kebab/Grills	frozen, 10 min meals	-	22-24 gms	18	24	432
BCF-03-A-006	Chicken Grill - Base Marinade	Frozen	Multi-use Meat	Kebab/Grills	frozen, 10 min meals	-	20-22 gms	12	24	288
BCF-03-A-007	Fish Kebab - Tikka.	Frozen	Multi-use Meat	Kebab/Grills	frozen, 10 min meals	-	22-24 gms	32	24	768
BCF-03-A-008	Fish Kebab - Reshmi	Frozen	Multi-use Meat	Kebab/Grills	frozen, 10 min meals	-	22-24 gms	18	24	432
BCF-03-A-009	Fish Kebab- Hariyali	Frozen	Multi-use Meat	Kebab/Grills	frozen, 10 min meals	-	22-24 grms	17	24	408
BCF-03-A-010	Fish Kebab - Banjara	Frozen	Multi-use Meat	Kebab/Grills	frozen, 10 min meals	-	22-24 gms	17	24	408
BCF-03-A-011	Fish Kebab - Malai	Frozen	Multi-use Meat	Kebab/Grills	frozen, 10 min meals	-	22-24 gms	18	24	432
BCF-03-A-012	Fish Grill- Base Marinade	Frozen	Multi-use Meat	Kebab/Grills	frozen, 10 min meals	-	20-22 gms	28	24	672
BCF-03-B-001	Garlic Pulled Chicken	Frozen	Multi-use Meat	Pulled Chicken	frozen, 10 min meals	-	1 Kg	460	-	460
BCF-03-B-002	BBQ Pulled Chicken	Frozen	Multi-use Meat	Pulled Chicken	frozen, 10 min meals	-	1 Kg	485	-	485
BCF-03-B-003	Schezwan Pulled Chicken	Frozen	Multi-use Meat	Pulled Chicken	frozen, 10 min meals	-	1 Kg	495	-	495
BCF-03-C-001	Chicken Seekh Kebab	Frozen	Multi-use Meat	Seekh Kebab	frozen, 10 min meals	-	1 Kg	28	-	28
BCF-03-C-002	Mutton Seekh Kebab	Frozen	Multi-use Meat	Seekh Kebab	frozen, 10 min meals	-	1 Kg	660	-	660
BCF-03-D-001	Chicken Sausage - Breakfast	Frozen	Multi-use Meat	Sausage	frozen, 10 min meals	-	1 Kg	625	-	625
BCF-03-D-002	Chicken Sausage - Cheesy Jalapeno	Frozen	Multi-use Meat	Sausage	frozen, sauces	-	1 Kg	685	-	685
BCF-03-D-003	Chicken Sausage - Smokey	Frozen	Multi-use Meat	Sausage	frozen, sauces	-	1 Kg	685	-	685
BCF-05-A-002	Pan Fry Sauce	Chilled	Sauce/Marinade	Momo Sauce	frozen, sauces	-	1. Kg	225	-	225
BCF-05-A-003	Tangy Mustard Sauce	Shelf-stable	Sauce/Marinade	Indian Dip	frozen, sauces	-	1 Kg	120	-	120
BCF-05-A-004	Chilli Chinese Sauce	Chilled	Sauce/Marinade	Chinese Ready Sauce	frozen, sauces	-	1 Kg	360	-	360
BCF-05-A-005	Garlic Chinese Sauce	Chilled	Sauce/Marinade	Chinese Ready Sauce	frozen, sauces	-	1 Kg	350	-	350
BCF-05-A-006	Manchurian Chinese Sauce	Chilled	Sauce/Marinade	Chinese Ready Sauce	frozen, sauces	-	1 kg	420	-	420
BCF-05-A-007	Red Chilli Paste	Chilled	Sauce/Marinade	Chinese Ready Sauce	frozen, sauces	-	1 Kg	570	-	570
BCF-05-A-008	 Teriyaki Sauce (Ch Wings / Oriental Mains)	Chilled	Sauce/Marinade	Chinese Ready Sauce	frozen, sauces	-	1 Ke	340	-	340
BCF-05-A-009	BBQ Sauce (Ch Wings/ Stick Kebab / BBQ)	Chilled	Sauce/Marinade	Chinese Wings Sauce	frozen, sauces	-	1 Kg	410	-	410
BCF-05-A-010	Hot Buffalo Sauce (Ch Wings/ Stick Kebab / BBQ)	Chilled	Sauce/Marinade	Chinese Wings Sauce	frozen, sauces	-	1 Kg	445	-	445
BCF-05-A-011	Satay Sauce (Ch Wings/ Stick Kebab / BBQ)	Chilled	Sauce/Marinade	Chinese Wings Sauce	frozen, sauces	-	1 Kg	860	-	860
BCF-05-A-012	Tartar Sauce	Chilled	Sauce/Marinade	Continental Dip	frozen, sauces	-	1 Kg	380	-	380
BCF-05-A-013	Tikka Marinade	Chilled	Sauce/Marinade	Kebab Marinade	frozen, sauces	-	1 Kg	490	-	490
BCF-05-A-014	Hariyali Marinade	Chilled	Sauce/Marinade	Kebab Marinade	frozen, sauces	-	1 Kg	560	-	560
BCF-05-A-015	Reshmi Marinade	Chilled	Sauce/Marinade	Kebab Marinade	frozen, sauces	-	1 Kg	680	-	680
BCF-05-A-016	Banjara Marinade	Chilled	Sauce/Marinade	Kebab Marinade	frozen, sauces	-	1 Kg	520	-	520
BCF-05-A-017	Red Chutney	Chilled	Sauce/Marinade	Chaat Sauce	frozen, sauces	-	1 Kg	220	-	220
BCF-05-A-018	Green Chutney	Chilled	Sauce/Marinade	Chaat Sauce	frozen, sauces	-	1 Kg	290	-	290
BCF-05-A-019	Vada Pav Khara Masala	Shelf-stable	Sauce/Marinade	Sauce/Marinade	frozen, sauces	-	1 Kg	360	-	360
BCF-R1-A-001	Chicken Whole - with skin	Fresh/Frozen	Raw Meat	Raw Chicken	fresh meat	-	1 kg pack	0	-	0
BCF-R1-A-002	Chicken Whole - skinless	Fresh	Raw Meat	Raw Chicken	fresh meat	-	1 kg pack	0	-	0
BCF-R1-A-003	Chicken Curry Cut	Fresh	Raw Meat	Raw Chicken	fresh meat	-	1 kg pack	0	-	0
BCF-R1-A-004	Chicken Breast Boneless	Fresh / Frozen	Raw Meat	Raw Chicken	fresh meat	-	1 kg pack	0	-	0
BCF-R1-A-005	Chicken Thigh Boneless	Fresh	Raw Meat	Raw Chicken	fresh meat	-	1 kg pack	0	-	0
BCF-R1-A-006	Chicken Drumstick / Thigh	Fresh	Raw Meat	Raw Chicken	fresh meat	-	1 kg pack	0	-	0
BCF-R1-A-007	Chicken Keema	Fresh	Raw Meat	Raw Chicken	fresh meat	-	1 kg pack	0	-	0
BCF-R1-A-008	Chicken Wings - skinless	Fresh	Raw Meat	Raw Chicken	fresh meat	-	1 kg pack	0	-	0
BCF-R1-A-009	Chicken Wings - with Skin	Fresh / Frozen	Raw Meat	Raw Chicken	fresh meat	-	1 kg pack	0	-	0
BCF-R1-A-010	Chicken Biryani Cut	Fresh	Raw Meat	Raw Chicken	fresh meat	-	1 kg pack	0	-	0
BCF-R1-A-011	Chicken Small Tandoori	Fresh	Raw Meat	Raw Chicken	fresh meat	-	1 kg pack	0	-	0
BCF-R1-A-012	Chicken Liver/Gizzard/Heart	Fresh.	Raw Meat	Raw Chicken	fresh meat	-	1 kg pack	0	-	0
BCF-R1-A-013	Chicken V cut	Fresh	Raw Meat	Raw Chicken	fresh meat	-	1 kg pack	0	-	0
BCF-R1-A-014	Chicken Soup Bone (meat on)	Fresh	Raw Meat	Raw Chicken	fresh meat	-	1 kg pack	0	-	0
BCF-04-A-001	Jhuri Aloo Bhaja	Shelf-stable	Indian Main Course	Indian Bengali	10 min meals, indian	-	1 Kg	360	-	360
BCF-04-A-002	Chicken Kasha (3 pcs)	Chilled	Indian Main Course	Indian Bengali	10 min meals, indian	-	Plate	96	-	96
BCF-04-A-003	Chicken Dakbungalow (3 pcs)	Chilled	Indian Main Course	Indian Bengali	10 min meals, indian	-	Plate	111	-	111
BCF-04-A-004	Doi Chicken (3 pcs)	Chilled	Indian Main Course	Indian Bengali	10 min meals, indian	-	Plate	112	-	112
BCF-04-A-005	Mutton Kasha (3 pcs)	Frozen	Indian Main Course	Indian Bengali	10 min meals, indian	-	Plate	290	-	290
BCF-04-A-006	Mutton Dakbungalow (3 pcs)	Frozen	Indian Main Course	Indian Bengali	10 min meals, indian	-	Plate	280	-	280
BCF-04-A-007	Katla Kalia (Gravy only)	Frozen	Indian Main Course	Indian Bengali	10 min meals, indian	-	1 Kg	245	-	245
BCF-04-A-008	Doi Katla (Gravy only)	Frozen	Indian Main Course	Indian Bengali	10 min meals, indian	-	1 Kg	265	-	265
BCF-04-A-009	Ghugni	Chilled	Indian Main Course	Indian Bengali	10 min meals, indian	-	1 Kg	160	-	160
BCF-04-A-010	Chingri Malai (Gravy only)	Frozen	Indian Main Course	Indian-General	10 min meals, indian	-	1 Kg	280	-	280
BCF-04-A-011	Chicken Stew (3 pcs)	Chilled	Indian Main Course	Indian-General	10 min meals, indian	-	Plate	94	-	94
BCF-04-A-012	Veg Stew (1 serving)	Chilled	Indian Main Course	Indian-General	10 min meals, indian	-	Plate	76	-	76
BCF-04-A-013	Mix Veg	Frozen	Indian Main Course	Indian-General	10 min meals, indian	-	1 Kg	220	-	220
BCF-04-A-014	Paneer Makhani Gravy	Frozen	Indian Main Course	Indian-General	10 min meals, indian	-	1 Kg	250	-	250
BCF-04-A-015	Kofta Gravy	Frozen	Indian Main Course	Indian-General	10 min meals, indian	-	1 Kg	220	-	220
BCF-04-A-016	Dal Fry	Frozen	Indian Main Course	Indian-General	10 min meals, indian	-	1 Kg	150	-	150
BCF-04-A-017	Choley	Chilled	Indian Main Course	Indian-General	10 min meals, indian	-	1 Kg	270	-	270
BCF-04-A-018	Pav Bhaji Gravy	Frozen	Indian Main Course	Indian-General	10 min meals, indian	-	1 Kg	210	-	210
BCF-04-A-019	Red Gravy	Frozen	Indian Main Course	Indian-General	10 min meals, indian	-	1 Kg	320	-	320
BCF-04-A-020	White Gravy	Frozen	Indian Main Course	Indian-General	10 min meals, indian	-	1 Kg	420	-	420
BCF-04-A-021	Yellow Gravy	Frozen	Indian Main Course	Indian-General	10 min meals, indian	-	1 Kg	350	-	350
BCF-04-A-022	Matar Polao	Chilled	Indian Main Course	Indian-General	10 min meals, indian	-	1 Kg	220	-	220
BCF-04-A-023	Maharaja Polao	Chilled	Indian Main Course	Sub-Category	10 min meals, indian	-	1 Kg	260	-	260
BCF-04-A-024	Basanti Polao	Chilled	Indian Main Course	Sub-Category	10 min meals, indian	-	1 Kg	360	-	360
BCF-04-A-025	Kashmiri Polao	Chilled	Indian Main Course	Sub-Category	10 min meals, indian	-	1 Kg	280	-	280
BCF-06-A-001	Chicken Biryani - Grade A	Hot	Biryani	Kolkata Biryani	10 min meals, indian	-	Plate	110	-	110
BCF-06-A-002	Mutton Biryani - Grade A	Hot	Biryani	Kolkata Biryani	10 min meals, indian	-	Plate	190	-	190
BCF-06-A-003	Extra Chicken - Grade A	Hot	Biryani	Kolkata Biryani	10 min meals, indian	-	Piece	60	-	60
BCF-06-A-004	Extra Mutton - Grade A	Hot	Biryani	Kolkata Biryani	10 min meals, indian	-	Piece	140	-	140
BCF-06-A-005	Extra Rice - Grade A	Hot	Biryani	Kolkata Biryani	10 min meals, indian	-	Piece	50	-	50
BCF-06-A-006	Extra Aloo - Grade A	Hot	Biryani	Kolkata Biryani	10 min meals, indian	-	Piece	15	-	15
BCF-06-A-007	Chicken Biryani - Grade B	Hot	Biryani	Kolkata Biryani	10 min meals, indian	-	Plate	85	-	85
BCF-06-A-008	Mutton Biryani - Grade B	Hot	Biryani	Kolkata Biryani	10 min meals, indian	-	Plate	130	-	130
BCF-06-A-009	Extra Chicken - Grade B	Hot	Biryani	Kolkata Biryani	10 min meals, indian	-	Piece	45	-	45
BCF-06-A-010	Extra Mutton - Grade B	Hot	Biryani	Kolkata Biryani	10 min meals, indian	-	Piece	90	-	90
BCF-06-A-011	Extra Rice - Grade B	Hot	Biryani	Kolkata Biryani	10 min meals, indian	-	Piece	50	-	50
BCF-06-A-012	Extra Aloo	Hot	Biryani	Kolkata Biryani	10 min meals, indian	-	Piece	15	-	15
BCF-06-A-013	Extra Katla	Hot	Biryani	Kolkata Biryani	10 min meals, indian	-	Piece	80	-	80
BCF-06-A-014	Extra Bagda Chingri	Hot	Biryani	Kolkata Biryani	10 min meals, indian	-	Piece	100	-	100
BCF-06-A-015	Extra Boiled Egg	Hot	Biryani	Kolkata Biryani	10 min meals, indian	-	Piece	15	-	15
BCF-06-A-016	Chicken Biryani	Hot	Biryani	Dhakal Kacchi Biryani	10 min meals, indian	-	Plate	120	-	120
BCF-06-A-017	Mutton Biryani	Hot	Biryani	Dhakai Kacchi Biryani	10 min meals, indian	-	Plate	200	-	200
BCF-06-A-018	Extra Chicken	Hot	Biryani	Dhakai Kacchi Biryani	10 min meals, indian	-	Piece	70	-	70
BCF-06-A-019	Extra Mutton	Hot	Biryani	Dhakai Kacchi Biryani	10 min meals, indian	-	Piece	150	-	150
BCF-06-A-020	Katla	Hot	Biryani	Dhakal Kacchi Biryani	10 min meals, indian	-	Piece	90	-	90
BCF-06-A-021	Bagda Chingri	Hot	Biryani	Dhakai Kacchi Biryani	10 min meals, indian	-	Piece	110	-	110
BCF-06-A-022	Chicken Biryani	Hot	Biryani	Hyderabadi Biryani	10 min meals, indian	-	Plate	120	-	120
BCF-06-A-023	Mutton Biryani	Hot	Biryani	Hyderabadi Biryani	10 min meals, indian	-	Plate	200	-	200
BCF-06-A-024	Extra Chicken	Hot	Biryani	Hyderabadi Biryani	10 min meals, indian	-	Piece	70	-	70
BCF-06-A-025	Extra Mutton	Hot	Biryani	Hyderabadi Biryani	10 min meals, indian	-	Piece	150	-	150
BCF-07-A-001	Walnut Brownie	Frozen	Dessert	Brownie/Cake	desserts	-	80-82 gms	25	10	250
BCF-07-A-002	Chocochip Brownie	Frozen	Dessert	Brownie/Cake	desserts	-	80-82 gms	24	10	240
BCF-07-A-003	Hazelnut Brownie	Frozen	Dessert	Brownie/Cake	desserts	-	80-82 gms	30	10	300
BCF-07-A-004	Choco Lava	Frozen	Dessert	Brownie/Cake	desserts	-	80-82 gms	24	10	240
BCF-07-A-005	Oreo Choco Lava	Frozen	Dessert	Brownie/Cake	desserts	-	80-82 gms	24	10	240
BCF-07-A-006	Banoffee Mousse Jar	Frozen	Dessert	Brownie/Cake	desserts	-	80-82 gms	42	10	420
BCF-07-A-007	Lotus Biscoff Mousse Jar	Frozen	Dessert	Brownie/Cake	desserts	-	80-82 gms	67	10	670
BCF-07-A-008	Chocolate Decadence Mousse Jar	Frozen	Dessert	Brownie/Cake	desserts	-	90-95 gms	50	10	500
BCF-07-A-010	Gajar Halwa	Frozen	Dessert	Sweets	desserts	-	1 Kg	500	-	500
BCF-07-A-011	Moong Dal Halwa	Frozen	Dessert	Sweets	desserts	-	1 Kg	280	-	280
BCF-07-A-012	Gulab Jamun	Chilled	Dessert	Sweets	desserts	-	Piece	22	-	22
BCF-07-A-013	Pantua	Chilled	Dessert	Sweets	desserts	-	Piece	12	-	12`;

async function seed() {
    const client = new Client(config);
    await client.connect();
    console.log("Connected to Cloud SQL...");

    // Clear existing products to ensure clean seed as requested ("create new for our products")
    await client.query("DELETE FROM product");
    console.log("Cleared existing products.");

    const lines = rawData.split('\n');
    let count = 0;

    for (const line of lines) {
        if (!line.trim()) continue;
        const parts = line.split('\t');
        if (parts.length < 11) {
            console.warn(`Skipping invalid line: ${line}`);
            continue;
        }

        const [idStr, name, storage, category, subCategory, tagsStr, size, weight, unitPrice, unitPack, packPricing] = parts;

        // Map Category to App structure
        // frozen, 5 min meals -> 'frozen'
        // fresh meat -> 'meat'
        // 10 min meals, indian -> '10min'
        // desserts -> 'dessert' (we'll treat as 'frozen' or 'grocery' for now if not matching app categories)
        let appCategory = 'frozen'; // fallback
        const lowerTags = tagsStr.toLowerCase();
        if (lowerTags.includes('fresh meat')) appCategory = 'meat';
        else if (lowerTags.includes('5 min')) appCategory = '5min';
        else if (lowerTags.includes('10 min')) appCategory = '10min';
        else if (lowerTags.includes('desserts')) appCategory = 'frozen'; // map to frozen for now
        else if (category.toLowerCase() === 'fried items') appCategory = 'frozen';

        const finalName = size !== '-' ? `${name} - ${size}` : name;
        const description = `${category} | ${subCategory} | Weight: ${weight} | Pack Size: ${unitPack}`;
        const basePrice = parseFloat(packPricing) || 0;
        const tags = tagsStr.split(',').map(t => t.trim());
        tags.push(storage, category, subCategory);

        const query = `
            INSERT INTO product (
                name, description, image, category, "basePrice", rating, reviews,
                time, difficulty, servings, ingredients, steps, nutrition,
                utensils, "userReviews", "bulkTiers", tags, "spiceLevel",
                unit, "authorName", status, "isApproved", "createdAt", "updatedAt"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, NOW(), NOW())
        `;

        const values = [
            finalName,
            description,
            'https://storage.googleapis.com/bluecrate-assets/placeholders/coming-soon.jpg', // Placeholder
            appCategory,
            basePrice,
            4.5, // Default rating
            0,   // Reviews
            lowerTags.includes('5 min') ? '5 min' : '10 min',
            'Easy',
            1,   // Default servings
            JSON.stringify([]),
            JSON.stringify([]),
            JSON.stringify({ calories: 0, protein: 0, carbs: 0, fat: 0 }),
            JSON.stringify([]),
            JSON.stringify([]),
            JSON.stringify([{ quantity: unitPack, price: basePrice }]),
            JSON.stringify(tags),
            0,   // Spice level
            unitPack,
            'BlueCrate Admin',
            'approved',
            true
        ];

        await client.query(query, values);
        count++;
    }

    console.log(`Successfully seeded ${count} products.`);
    await client.end();
}

seed().catch(err => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
