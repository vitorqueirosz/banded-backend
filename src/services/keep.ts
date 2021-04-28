// const bands: BandResponse[] = await Band.find({
//   city: new RegExp(city),
// }).populate([
//   {
//     path: 'genres',
//     model: 'BandGenres',
//     populate: {
//       path: 'genre',
//       model: 'Genre',
//     },
//   },
//   {
//     path: 'albums',
//     model: 'BandAlbums',
//     populate: {
//       path: 'genre',
//       model: 'Genre',
//     },
//   },
//   {
//     path: 'albums',
//     model: 'BandAlbums',
//     populate: {
//       path: 'musics',
//       model: 'BandMusics',
//     },
//   },
//   {
//     path: 'musics',
//     model: 'BandMusics',
//     populate: {
//       path: 'genre',
//       model: 'Genre',
//     },
//   },
//   {
//     path: 'musics',
//     model: 'BandMusics',
//     populate: {
//       path: 'album',
//       model: 'BandAlbums',
//     },
//   },
//   {
//     path: 'members',
//     model: 'BandMembers',
//     populate: {
//       path: 'user',
//       model: 'User',
//     },
//   },
//   {
//     path: 'owner',
//     model: 'User',
//   },
// ]);
