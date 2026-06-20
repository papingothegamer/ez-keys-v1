export interface LibrarySong {
  id: string;
  title: string;
  genre: string;
  defaultBpm: number;
  timeSignature: string;
  progression: string;
}

export const SONG_LIBRARY: LibrarySong[] = [
  {
    "id": "worship-1",
    "title": "You Are Alpha and Omega",
    "genre": "Worship",
    "defaultBpm": 120,
    "timeSignature": "4/4",
    "progression": "You are [1]Al-pha [2]and [3]O-[4]me-[1]ga\nWe [4]worship [2]You our [1]Lord\n[6]You are [4]wor-[6]thy [5]to be [1]praised\nWe give You [6]all [5]the [4]glo-[1]ry\n[3]We [4]worship [5]You our [6]Lord\nYou are [5]wor-[3]thy [4]to [5]be [1]praised"
  },
  {
    "id": "worship-2",
    "title": "Praise",
    "genre": "Worship",
    "defaultBpm": 120,
    "timeSignature": "4/4",
    "progression": "I'll [1]praise in the valley\n[4]Praise on the [1]moun-tain\nI'll [5]praise when I'm sure\n[4]Praise when I'm [1]doub-ting\nI'll [1]praise when out-numbered\n[4]Praise when [1]surrounded\n[5]'Cause praise is the water\n[4]My enemies [1]drown in\nAs [5]long as I'm breathing\n[4]I've got a [5]rea-son to\n[6]Praise [4]the [1]Lord, oh my [5]soul"
  },
  {
    "id": "worship-3",
    "title": "Kadosh",
    "genre": "Worship",
    "defaultBpm": 120,
    "timeSignature": "4/4",
    "progression": "[4]Ka-dosh, Ka-dosh, Ka-[5]dosh, Ka-do[1]sh, Ka-dosh\nIs the [2]Lamb of God who [5]sits u-pon the [6]throne\n[4]He a-lone is [5]wor-thy of our [1]praise"
  },
  {
    "id": "ccm-1",
    "title": "You Are Able (Creator of the Universe)",
    "genre": "CCM",
    "defaultBpm": 120,
    "timeSignature": "4/4",
    "progression": "[1]Creator of the [5] universe\n[6]What can't  You [4]do\n[1]What can't You [5]change\n[3]Je-[4]sus,\nYou are [1]a-[5]ble\n[2]Great and [3]mighty [4]God\nYou are [1]a-[5]ble, [3]Je-[4]sus"
  },
  {
    "id": "ccm-2",
    "title": "I Will Call Upon The Lord (Magnify)",
    "genre": "CCM",
    "defaultBpm": 120,
    "timeSignature": "4/4",
    "progression": "[1]I will call upon the Lord\n[6]Who is [4]worthy to be [1]praised\n[1]So shall [4]I be [5]saved from my [4]ene-mies\n[1]The Lord li-veth, and [4]bles-sed be the [1]rock\nAnd let the [4]God of my sal-[6]va-tion be ex-[5]al-[1]ted"
  },
  {
    "id": "ccm-3",
    "title": "Covenant Keeping God",
    "genre": "CCM",
    "defaultBpm": 120,
    "timeSignature": "4/4",
    "progression": "You'll ne-ver [4]leave me\nYou said that You won't for-[4]sake me\n[5]You are be-[6]side me and [1]that is all that mat-[5]ters\n[4]You are the [4]co-ve-nant [5]kee-ping [6]God\n[1]You are the [4]co-ve-nant [6]kee-ping [5]God"
  },
  {
    "id": "ccm-4",
    "title": "Yahweh, Rapha (Updated)",
    "genre": "CCM",
    "defaultBpm": 120,
    "timeSignature": "4/4",
    "progression": "Yah-[4]weh, [6]Ra-[5]pha, Elo-[3]him, Shad-[6]dai, [3]Ji-[4]reh, [6]Ado-[5]nai, come and [3]mani-[5]fest your-[6]self"
  },
  {
    "id": "ccm-5",
    "title": "Hallelujah Eh",
    "genre": "CCM",
    "defaultBpm": 120,
    "timeSignature": "4/4",
    "progression": "[1]Hallelujah eh\nHallelu-jah [4]ooo\n[5]Hallelujah eh\nIt's the sound of [1]vic-to-ry\n[1]Hallelujah eh\nHallelu-jah [4]ooo\nLet the [5]sound of re-[4]joi-[5]cing fill this [1]place"
  },
  {
    "id": "african-1",
    "title": "Tambira Jehovah",
    "genre": "African Medley",
    "defaultBpm": 120,
    "timeSignature": "4/4",
    "progression": "[1]Tam-bi-ra Je-[4]ho-vah\n[5]Tam-bi-ra Je-[1]ho-vah\n[1]Iyele-iyelele, [4]Iyelele-iyelele\n[5]Tam-bi-ra Je-[1]ho-vah"
  },
  {
    "id": "african-2",
    "title": "I've Got Joy (Joy Overflow)",
    "genre": "African Medley",
    "defaultBpm": 120,
    "timeSignature": "4/4",
    "progression": "[1]I've got joy, joy, joy, joy, [5]joy, joy, joy\nJoy o-ver-[4]flows in [5]my [6]life\n[1]I've got joy, joy, joy, joy, [5]joy, joy, joy\nJoy o-ver-[4]flows in [5]my [1]life"
  },
  {
    "id": "african-3",
    "title": "Comment Ne Pas Te Louer",
    "genre": "African Medley",
    "defaultBpm": 120,
    "timeSignature": "4/4",
    "progression": "[1]Com-ment ne pas te lou-[4]e— e- [5]er\nCom-ment ne pas te lou-[1]ee— e- [6]er\nCom-ment ne pas te lou-[2]ee— e- [5]er\nSei-gneur Jé-[1]sus\n[1]Quand je re-garde au-tour de [4]moi\n[4]Je vois ta [5]gloire\nSei-gneur Jé-[1]sus, je te bé-[6]nis\nCom-ment ne pas te lou-[2]ee— e- [5]er\nSei-gneur Jé-[1]sus"
  },
  {
    "id": "african-4",
    "title": "Eh Yahweh Kumama",
    "genre": "African Medley",
    "defaultBpm": 120,
    "timeSignature": "4/4",
    "progression": "[1]Eh Yah-weh, Eh [5]Yah-weh, [6]Ku-ma-ma\nEh Yah-[4]weh, Eh [5]Yah-weh, [1]Ku-ma-ma"
  },
  {
    "id": "african-5",
    "title": "Jehovah You Are The Most High",
    "genre": "African Medley",
    "defaultBpm": 120,
    "timeSignature": "4/4",
    "progression": "Je-ho-vah [4]You are the most [6]high\nJe-ho-vah [5]You are the most high [1]God\nJe-ho-vah [4]e— [6]eh\nJe-ho-vah [5]a— [1]ah"
  },
  {
    "id": "african-6",
    "title": "Who Has The Final Say",
    "genre": "African Medley",
    "defaultBpm": 120,
    "timeSignature": "4/4",
    "progression": "[1]Who has the fi-[4]nal [3]say?\n[6]Je-ho-[4]vah has the [5]fi-nal [1]say\n[1]Who has the fi-[4]nal [3]say?\n[6]Je-ho-[4]vah has the [5]fi-nal [1]say\nJe-ho-vah [1]turned my life around\nJe-ho-vah [1]turned my life [5]around\nHe [6]makes a [5]way where there [4]is no [2]way\n[4]Je-ho-vah has the [5]fi-nal [1]say"
  }
];
