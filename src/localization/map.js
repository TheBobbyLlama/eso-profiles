const mapKey =  (rawText) => {
	switch (rawText.toString().toLowerCase()) {
		case "0":
			return "GENDER_MALE";
		case "1":
			return "GENDER_FEMALE";
		case "altmer":
			return "RACE_ALTMER";
		case "argonian":
			return "RACE_ARGONIAN";
		case "bosmer":
			return "RACE_BOSMER";
		case "breton":
			return "RACE_BRETON";
		case "dunmer":
			return "RACE_DUNMER";
		case "imperial":
			return "RACE_IMPERIAL";
		case "khajiit":
			return "RACE_KHAJIIT";
		case "nord":
			return "RACE_NORD";
		case "orc":
			return "RACE_ORC";
		case "redguard":
			return "RACE_REDGUARD";
		case "khajiit (ohmes)":
			return "RACE_KHAJIIT_OHMES";
		case "moarmer":
			return "RACE_MAROMER";
		case "reachman":
			return "RACE_REACHMAN";
		case "ashlander":
			return "RACE_ASHLANDER";
		case "werewolf":
			return "SUPERNATURAL_WEREWOLF";
		case "vampire":
			return "SUPERNATURAL_VAMPIRE";
		case "vampire (daggerfall)":
			return "SUPERNATURAL_VAMPIRE_DAGGERFALL";
		case "vampire (aundae)":
			return "SUPERNATURAL_VAMPIRE_AUNDAE";
		case "vampire (berne)":
			return "SUPERNATURAL_VAMPIRE_BERNE";
		case "vampire (quarra)":
			return "SUPERNATURAL_VAMPIRE_QUARRA";
		case "vampire (cyrodiil)":
			return "SUPERNATURAL_VAMPIRE_CYRODIIL";
		case "vamnpire (child of coldharbour)":
		case "vampire (volkihar)":
			return "SUPERNATURAL_VAMPIRE_VOLKIHAR"
		default:
			return rawText;
	}
}

export default mapKey;