const mapKey =  (rawText) => {
	switch (rawText.toString().toLowerCase()) {
		case "0":
			return "GENDER_MALE";
		case "1":
			return "GENDER_FEMALE";
		case "arcanist":
			return "CLASS_ARCANIST";
		case "dragonknight":
			return "CLASS_DRAGONKNIGHT";
		case "necromancer":
			return "CLASS_NECROMANCER";
		case "nightblade":
			return "CLASS_NIGHTBLADE";
		case "sorcerer":
			return "CLASS_SORCERER";
		case "templar":
			return "CLASS_TEMPLAR";
		case "warden":
			return "CLASS_WARDEN";
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
		case "maormer":
			return "RACE_MAORMER";
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
			return "SUPERNATURAL_VAMPIRE_CHILD_OF_COLDHARBOUR";
		default:
			return rawText;
	}
}

export default mapKey;