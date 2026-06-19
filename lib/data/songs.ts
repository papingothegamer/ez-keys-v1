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
    "id": "hymn-1",
    "title": "Amazing Grace",
    "genre": "Gospel",
    "defaultBpm": 90,
    "timeSignature": "3/4",
    "progression": "[1] Amazing grace how [1] sweet the [1] sound\nThat [4] saved a [4] wretch like [1] me! [1]\n[1] I once was [1] lost, but [6m] now am [5] found, [5]\nWas [1] blind, but [4] now I [1] see. [1]"
  },
  {
    "id": "hymn-2",
    "title": "Be Thou My Vision",
    "genre": "CCM",
    "defaultBpm": 80,
    "timeSignature": "3/4",
    "progression": "[1] Be Thou my [1] vision, O [5] Lord of my [1] heart [1]\n[5] Naught be all [5] else to me, [4] save that Thou [5] art [5]\n[4] Thou my best [4] thought, by [1] day or by [6m] night [6m]\n[1] Waking or [6m] sleeping, Thy [4] presence my [1] light [1]"
  },
  {
    "id": "hymn-3",
    "title": "How Great Thou Art",
    "genre": "Gospel",
    "defaultBpm": 85,
    "timeSignature": "4/4",
    "progression": "[1] O Lord my God, when I in awesome [4] wonder,\nConsider [1] all the worlds Thy [5] hands have [1] made;\n[1] I see the stars, I hear the rolling [4] thunder,\nThy power through-[1]out the [5] universe dis-[1]played.\n\nChorus:\nThen sings my [1] soul, my [4] Savior God, to [1] Thee,\nHow great Thou [2m] art, [5] how great Thou [1] art!\nThen sings my [1] soul, my [4] Savior God, to [1] Thee,\nHow great Thou [2m] art, [5] how great Thou [1] art!"
  },
  {
    "id": "hymn-4",
    "title": "It Is Well With My Soul",
    "genre": "CCM",
    "defaultBpm": 75,
    "timeSignature": "4/4",
    "progression": "[1] When peace like a [1] river, at-[4]tendeth my [5] way,\nWhen [6m] sorrows like [2m] sea billows [5] roll\nWhat-[1]ever my [4] lot, Thou hast [2m] taught me to [5] say\nIt is [1] well, it is [4] well, with my [1] soul\n\nChorus:\nIt is [1] well (it is [5] well)\nWith my [5] soul (with my [1] soul)\nIt is [4] well, it is [5] well with my [1] soul"
  },
  {
    "id": "hymn-5",
    "title": "Great Is Thy Faithfulness",
    "genre": "Gospel",
    "defaultBpm": 80,
    "timeSignature": "3/4",
    "progression": "[1] Great is Thy [4] faithfulness, [5] O God my [1] Father;\n[4] There is no [1] shadow of [2m] turning with [5] Thee;\n[5] Thou changest [1] not, Thy com-[4]passions, they fail not;\n[2m] As Thou hast [1] been, Thou for-[5]ever will [1] be.\n\nChorus:\n[5] Great is Thy [1] faithfulness!\n[6] Great is Thy [2m] faithfulness!\n[5] Morning by [1] morning new [2m] mercies I [5] see;\n[5] All I have [1] needed Thy [4] hand hath pro-[1]vided;\n[4] Great is Thy [1] faithfulness, [5] Lord, unto [1] me!"
  },
  {
    "id": "hymn-6",
    "title": "Come Thou Fount",
    "genre": "CCM",
    "defaultBpm": 100,
    "timeSignature": "3/4",
    "progression": "[1] Come Thou [5] Fount of every [4] bless-[1]ing\n[1] Tune my [5] heart to sing Thy [4] grace [1]\n[1] Streams of [5] mercy, never [4] ceas-[1]ing\n[1] Call for [5] songs of loudest [4] praise [1]\n\n[1] Teach me [4] some melodious [1] son-[5]net\n[1] Sung by [4] flaming tongues a-[5]bove\n[1] Praise the [5] mount, I'm fixed up-[4]on [1] it\n[1] Mount of [5] Thy redeeming [4] love [1]"
  },
  {
    "id": "hymn-7",
    "title": "Nothing But The Blood",
    "genre": "Gospel",
    "defaultBpm": 95,
    "timeSignature": "4/4",
    "progression": "[1] What can wash a-[1]way my sin?\n[6m] Nothing but the [5] blood of [1] Jesus;\n[1] What can make me [1] whole again?\n[6m] Nothing but the [5] blood of [1] Jesus.\n\nChorus:\n[1] Oh! precious [1] is the flow\n[5] That makes me [5] white as snow;\n[1] No other [1] fount I know,\n[6m] Nothing but the [5] blood of [1] Jesus."
  },
  {
    "id": "hymn-8",
    "title": "Holy, Holy, Holy",
    "genre": "Traditional",
    "defaultBpm": 80,
    "timeSignature": "4/4",
    "progression": "[1] Holy, [6m] holy, [4] ho-[1]ly!\n[4] Lord [1] God Al-[5]might-[5]y!\n[1] Early [6m] in the [2m] morn-[1]ing\nOur [2m] song shall [1] rise to [5] Thee\n[1] Holy, [6m] holy, [4] ho-[1]ly!\n[4] Merciful [1] and [5] might-[5]y!\n[6m] God in [1] three [4] Per-[1]sons,\n[4] blessed [5] Trini-[1]ty!"
  },
  {
    "id": "hymn-9",
    "title": "Blessed Assurance",
    "genre": "Gospel",
    "defaultBpm": 90,
    "timeSignature": "9/8",
    "progression": "[1] Blessed as-[4]surance, [1] Jesus is [1] mine;\n[2m] Oh, what a [2m] foretaste of [5] glory di-[5]vine!\n[1] Heir of sal-[4]vation, [1] purchase of [1] God,\n[2m] Born of His [1] Spirit, [5] washed in His [1] blood.\n\nChorus:\n[1] This is my [4] story, [1] this is my [1] song,\n[4] Praising my [1] Savior [2m] all the day [5] long.\n[1] This is my [4] story, [1] this is my [1] song,\n[4] Praising my [1] Savior [5] all the day [1] long."
  },
  {
    "id": "jazz-1",
    "title": "Aura Lee (Traditional)",
    "genre": "Jazz",
    "defaultBpm": 80,
    "timeSignature": "4/4",
    "progression": "[1] As the blackbird [6m] in the spring,\n[2m] 'Neath the willow [5] tree,\n[1] Sat and piped, I [6m] heard him sing,\n[2m] Singing [5] Aura [1] Lee.\n\nChorus:\n[1] Aura Lee, [6m] Aura Lee,\n[2m] Maid with golden [5] hair;\n[1] Sunshine came a-[6m]long with thee,\n[2m] And swallows [5] in the [1] air."
  },
  {
    "id": "jazz-2",
    "title": "When The Saints Go Marching In",
    "genre": "Jazz",
    "defaultBpm": 120,
    "timeSignature": "4/4",
    "progression": "Oh, when the [1] saints [1]\nGo marching [1] in [1]\nOh, when the [1] saints go [1] marching [5] in [5]\nLord, how I [1] want [1/3] to be in that [4] number [4]\nWhen the [1] saints go [5] marching [1] in [1]"
  },
  {
    "id": "folk-1",
    "title": "Wayfaring Stranger",
    "genre": "Folk",
    "defaultBpm": 75,
    "timeSignature": "4/4",
    "progression": "[6m] I am a poor wayfaring stranger,\n[6m] While journeying through this world of [2m] woe, [2m]\n[6m] Yet there's no sickness, toil nor danger,\n[6m] In that bright world to which I [2m] go. [2m]\n\nChorus:\n[4] I'm going there to see my [1] father,\n[4] I'm going there no more to [3] roam;\n[6m] I'm only going over Jordan,\n[6m] I'm only [2m] going over [6m] home."
  },
  {
    "id": "folk-2",
    "title": "Shenandoah",
    "genre": "Folk",
    "defaultBpm": 70,
    "timeSignature": "4/4",
    "progression": "Oh [1] Shenandoah, I [4] long to see [1] you,\nA-[4]way you rolling [1] river\nOh [6m] Shenandoah, I [3m] long to see you,\nA-[4]way, I'm [1] bound a-[6m]way\n'Cross the [2m] wide [5] Missouri [1]"
  },
  {
    "id": "folk-3",
    "title": "Danny Boy",
    "genre": "Traditional",
    "defaultBpm": 65,
    "timeSignature": "4/4",
    "progression": "Oh Danny [1] boy, the pipes, the [4] pipes are [1] calling\nFrom glen to [1] glen, and down the [6m] mountain [5] side\nThe summer's [1] gone, and all the [4] roses [1] falling\n'Tis you, 'tis [1] you must [5] go and I must [1] bide\n\nBut come ye [6m] back when [4] summer's in the [1] meadow\nOr when the [6m] valley's [4] hushed and white with [5] snow\n'Tis I'll be [1] here in [4] sunshine or in [1] shadow\nOh Danny [1] boy, oh Danny [5] boy, I love you [1] so"
  },
  {
    "id": "gospel-19",
    "title": "Doxology",
    "genre": "Gospel",
    "defaultBpm": 80,
    "timeSignature": "4/4",
    "progression": "[1] Praise God, from [5] Whom all [4] blessings [1] flow;\n[1] Praise Him, all [5] creatures [4] here be-[1]low;\n[1] Praise Him a-[5]bove, ye [4] heavenly [1] host;\n[1] Praise Father, [5] Son, and [4] Holy [1] Ghost.\n[4] A-[1]men."
  }
];
