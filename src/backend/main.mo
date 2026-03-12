import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Map "mo:core/Map";

actor {
  type Song = {
    id : Nat;
    title : Text;
    artist : Text;
    language : Text;
    moods : [Text];
    duration : Text;
    genre : Text;
  };

  module Song {
    public func compareByTamilFirst(song1 : Song, song2 : Song) : Order.Order {
      let lang1 = if (song1.language == "Tamil") { "A" } else if (song1.language == "English") {
        "B";
      } else { "C" };
      let lang2 = if (song2.language == "Tamil") { "A" } else if (song2.language == "English") {
        "B";
      } else { "C" };
      switch (Text.compare(lang1, lang2)) {
        case (#equal) { Text.compare(song1.title, song2.title) };
        case (order) { order };
      };
    };
  };

  let songs = Map.empty<Nat, Song>();

  let initialSongs : [Song] = [
    { id = 1; title = "Vaathi Coming"; artist = "Anirudh"; language = "Tamil"; moods = ["energetic", "happy"]; duration = "3:27"; genre = "Soundtrack" },
    { id = 2; title = "Kannaana Kanney"; artist = "Sid Sriram"; language = "Tamil"; moods = ["calm", "romantic"]; duration = "4:15"; genre = "Soundtrack" },
    { id = 3; title = "Shape of You"; artist = "Ed Sheeran"; language = "English"; moods = ["happy", "romantic"]; duration = "3:53"; genre = "Pop" },
    { id = 4; title = "Believer"; artist = "Imagine Dragons"; language = "English"; moods = ["energetic", "focused"]; duration = "3:24"; genre = "Rock" },
    { id = 5; title = "Tum Hi Ho"; artist = "Arijit Singh"; language = "Hindi"; moods = ["romantic", "melancholic"]; duration = "4:22"; genre = "Soundtrack" },
    { id = 6; title = "Munbe Vaa"; artist = "Shreya Ghoshal"; language = "Tamil"; moods = ["romantic", "calm"]; duration = "5:24"; genre = "Soundtrack" },
    { id = 7; title = "Aaluma Doluma"; artist = "Ajith"; language = "Tamil"; moods = ["energetic", "party"]; duration = "3:33"; genre = "Soundtrack" },
    { id = 8; title = "Perfect"; artist = "Ed Sheeran"; language = "English"; moods = ["romantic", "calm"]; duration = "4:23"; genre = "Pop" },
    { id = 9; title = "Senorita"; artist = "Shawn Mendes"; language = "English"; moods = ["romantic", "happy"]; duration = "3:11"; genre = "Pop" },
    { id = 10; title = "Rowdy Baby"; artist = "Dhanush"; language = "Tamil"; moods = ["happy", "energetic"]; duration = "4:46"; genre = "Soundtrack" },
    { id = 11; title = "Vinnaithaandi Varuvaayaa"; artist = "AR Rahman"; language = "Tamil"; moods = ["romantic", "melancholic"]; duration = "5:12"; genre = "Soundtrack" },
    { id = 12; title = "Why This Kolaveri Di"; artist = "Dhanush"; language = "Tamil"; moods = ["happy", "quirky"]; duration = "4:08"; genre = "Soundtrack" },
    { id = 13; title = "Channa Mereya"; artist = "Arijit Singh"; language = "Hindi"; moods = ["melancholic", "romantic"]; duration = "5:12"; genre = "Soundtrack" },
    { id = 14; title = "Butta Bomma"; artist = "Armaan Malik"; language = "Telugu"; moods = ["happy", "romantic"]; duration = "3:18"; genre = "Soundtrack" },
    { id = 15; title = "Senjitaley"; artist = "Anirudh"; language = "Tamil"; moods = ["energetic", "romantic"]; duration = "3:45"; genre = "Soundtrack" },
    { id = 16; title = "Cheap Thrills"; artist = "Sia"; language = "English"; moods = ["party", "happy"]; duration = "3:44"; genre = "Pop" },
    { id = 17; title = "Urvashi"; artist = "AR Rahman"; language = "Tamil"; moods = ["energetic", "happy"]; duration = "4:20"; genre = "Soundtrack" },
    { id = 18; title = "Humsafar"; artist = "Akhil Sachdeva"; language = "Hindi"; moods = ["romantic", "calm"]; duration = "4:29"; genre = "Soundtrack" },
    { id = 19; title = "Nilaave Vaa"; artist = "SP Balasubrahmanyam"; language = "Tamil"; moods = ["calm", "melancholic"]; duration = "4:56"; genre = "Soundtrack" },
    { id = 20; title = "Bad Guy"; artist = "Billie Eilish"; language = "English"; moods = ["party", "energetic"]; duration = "3:14"; genre = "Pop" },
    { id = 21; title = "Tareefan"; artist = "Badshah"; language = "Hindi"; moods = ["party", "happy"]; duration = "3:08"; genre = "Soundtrack" },
    { id = 22; title = "Oru Kutty Kathai"; artist = "Anirudh"; language = "Tamil"; moods = ["happy", "storytelling"]; duration = "4:11"; genre = "Soundtrack" },
    { id = 23; title = "Memories"; artist = "Maroon 5"; language = "English"; moods = ["melancholic", "calm"]; duration = "3:09"; genre = "Pop" },
    { id = 24; title = "Samajavaragamana"; artist = "Sid Sriram"; language = "Telugu"; moods = ["romantic", "energetic"]; duration = "3:50"; genre = "Soundtrack" },
    { id = 25; title = "Idhazhin Oram"; artist = "Anirudh"; language = "Tamil"; moods = ["romantic", "melancholic"]; duration = "4:22"; genre = "Soundtrack" },
    { id = 26; title = "Blinding Lights"; artist = "The Weeknd"; language = "English"; moods = ["energetic", "focused"]; duration = "3:20"; genre = "Pop" },
    { id = 27; title = "Vaathi Raid"; artist = "Anirudh"; language = "Tamil"; moods = ["energetic", "motivational"]; duration = "2:49"; genre = "Soundtrack" },
    { id = 28; title = "Enami Enami"; artist = "Armaan Malik"; language = "Tamil"; moods = ["energetic", "happy"]; duration = "5:22"; genre = "Soundtrack" },
    { id = 29; title = "Despacito"; artist = "Luis Fonsi"; language = "Other"; moods = ["party", "energetic"]; duration = "3:47"; genre = "Pop" },
    { id = 30; title = "Bekhayali"; artist = "Arijit Singh"; language = "Hindi"; moods = ["melancholic", "romantic"]; duration = "6:10"; genre = "Soundtrack" },
    { id = 31; title = "Darshana"; artist = "Hesham Abdul Wahab"; language = "Malayalam"; moods = ["romantic", "happy"]; duration = "2:13"; genre = "Soundtrack" },
    { id = 32; title = "Malare"; artist = "Sachin Warrier"; language = "Malayalam"; moods = ["romantic", "calm"]; duration = "5:21"; genre = "Soundtrack" },
    { id = 33; title = "Kudukku"; artist = "Jakes Bejoy"; language = "Malayalam"; moods = ["energetic", "party"]; duration = "3:32"; genre = "Soundtrack" },
    { id = 34; title = "Tum Mile"; artist = "Pritam"; language = "Hindi"; moods = ["romantic", "rainy"]; duration = "4:36"; genre = "Soundtrack" },
    { id = 35; title = "Jeena Jeena"; artist = "Atif Aslam"; language = "Hindi"; moods = ["romantic", "calm"]; duration = "4:43"; genre = "Soundtrack" },
    { id = 36; title = "Sakhiyan"; artist = "Maninder Buttar"; language = "Punjabi"; moods = ["happy", "romantic"]; duration = "3:26"; genre = "Pop" },
    { id = 37; title = "High Rated Gabru"; artist = "Guru Randhawa"; language = "Punjabi"; moods = ["party", "happy"]; duration = "2:50"; genre = "Pop" },
    { id = 38; title = "Ramulo Ramulaa"; artist = "Anurag Kulkarni"; language = "Telugu"; moods = ["party", "energetic"]; duration = "4:06"; genre = "Soundtrack" },
    { id = 39; title = "Vasco Da Gama"; artist = "Shalu Shamu"; language = "Tamil"; moods = ["quirky", "energetic"]; duration = "3:13"; genre = "Soundtrack" },
    { id = 40; title = "Vennilave"; artist = "Hariharan"; language = "Tamil"; moods = ["romantic", "melancholic"]; duration = "5:36"; genre = "Soundtrack" },
    { id = 41; title = "Humsafar"; artist = "Akhil Sachdeva"; language = "Hindi"; moods = ["romantic", "calm"]; duration = "4:29"; genre = "Soundtrack" },
    { id = 42; title = "Akshayam Pole"; artist = "Najim Arshad"; language = "Malayalam"; moods = ["happy", "romantic"]; duration = "4:20"; genre = "Soundtrack" },
    { id = 43; title = "Vaseegara"; artist = "Bombay Jayashree"; language = "Tamil"; moods = ["romantic", "calm"]; duration = "4:30"; genre = "Soundtrack" },
    { id = 44; title = "Ghungroo"; artist = "Arijit Singh"; language = "Hindi"; moods = ["party", "happy"]; duration = "5:21"; genre = "Soundtrack" },
  ];

  let moodSet = Map.empty<Text, Bool>();

  // Initialize songs and moods
  for (song in initialSongs.values()) {
    songs.add(song.id, song);
    for (mood in song.moods.values()) {
      moodSet.add(mood, true);
    };
  };

  public query ({ caller }) func getSongsByMood(mood : Text) : async [Song] {
    let filteredSongs = songs.values().toArray().filter(
      func(song) {
        song.moods.find(func(m) { m == mood }) != null;
      }
    );
    filteredSongs.sort(Song.compareByTamilFirst);
  };

  public query ({ caller }) func getAvailableMoods() : async [Text] {
    moodSet.keys().toArray();
  };

  public query ({ caller }) func getSongsByLanguage(language : Text) : async [Song] {
    songs.values().toArray().filter(
      func(song) {
        song.language == language;
      }
    );
  };
};
