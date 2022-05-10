// try {
//     Deno.removeSync('./dist', { recursive: true });
// } catch (e) {
//     if (!(e instanceof Deno.errors.NotFound)) {
//         throw e;
//     }
// }
Deno.mkdirSync('./dist', {recursive: true});
Deno.mkdirSync('./dist/sighting', {recursive: true});

type Name = 'Andrew' | 'Ryan' | 'Jason' | 'Mom' | 'Dad';
type DateTime = string;
type FileName = string;
type Text = string;

const metadata: [FileName, Name, DateTime, Text][] = [
    ['41.jpg', 'Jason', '5/9/2022 2:30 PM', "Observing..."],
    ['40.jpg', 'Mom', '5/7/2022 2:26 PM', "I think everyone saw me here..."],
    ['39.jpg', 'Jason', '4/18/2022 8:30 PM', "No one will see me here!"],
    ['38.jpg', 'Andrew', '4/6/2022 7:13 AM', "This was a horrible hiding spot..."],
    ['37.jpg', 'Dad', '4/4/2022 4:43 PM', "Nobody will find me in this corner :)"],
    ['36.jpg', 'Andrew', '4/1/2022 1:19 PM', "How did I even get up here??"],
    ['35.jpg', 'Mom', '3/31/2022 10:37 PM', "Back where I belong"],
    ['34.jpg', 'Jason', '3/31/2022 4:38 PM', "I'm really high up"],
    ['33.jpg', 'Dad', '3/31/2022 8:05 AM', 'Spring will never come...'],
    ['32.jpg', 'Jason', '3/29/2022 3:31 PM', 'Floating in fake flowers'],
    ['31.jpg', 'Mom', '2/6/2022 6:41 PM', "I blend right in"],
    ['30.jpg', 'Jason', '2/3/2022 1:29 PM', ""],
    ['29.jpg', 'Ryan', '2/1/2022 6:54 PM', "I'm in plain sight! Somehow they didn't find me for two days"],
    ['28.jpg', 'Andrew', '1/29/2022 10:36 PM', "I've been put in a drawer"],
    ['27.jpg', 'Ryan', '1/29/2022 2:21 PM', "I've escaped the frame!"],
    ['26.jpg', 'Jason', '1/29/2022 1:23 PM', "I've been framed again..."],
    ['25.jpg', 'Mom', '1/28/2022 11:14 PM', "This flower is large"],
    ['24.jpg', 'Jason', '1/27/2022 8:07 PM', "It's kinda dark in here..."],
    ['23.jpg', 'Mom', '1/26/2022 7:15 PM', 'Is this plant real?'],
    ['22.jpg', 'Jason', '1/25/2022 11:03 AM', 'This is a big bowl :)'],
    ['21.jpg', 'Dad', '1/25/2022 8:32 AM', 'Still snow...'],
    ['20.jpg', 'Ryan', '1/24/2022 6:01 PM', 'What a mess...'],
    ['19.jpg', 'Dad', '1/22/2022 9:47 PM', 'No one will see me here :)'],
    ['18.jpg', 'Mom', '1/21/2022 11:23 AM', "Hmm these stairs are a little large"],
    ['17.jpg', 'Dad', '1/21/2022 8:02 AM', 'Always snow....'],
    ['16.jpg', 'Jason', '1/20/2022 7:38 PM', ''],
    ['15.jpg', 'Ryan', '1/20/2022 2:59 PM', ''],
    ['14.jpg', 'Jason', '1/20/2022 2:24 PM', 'My own letter!'],
    ['13.jpg', 'Mom', '1/20/2022 1:16 PM', "I'm trapped!!!"],
    ['12.jpg', 'Jason', '1/19/2022 9:01 PM', 'Hmm I wonder if I could play something...'],
    ['11.jpg', 'Ryan', '1/19/2022 5:42 PM', 'When will they get home...'],
    ['10.jpg', 'Andrew', '1/19/2022 8:07 AM', "Nice and comfortable :)"],
    ['9.jpg', 'Dad', '1/18/2022 10:46 PM', "Which tree should I choose?"],
    ['8.jpg', 'Jason', '1/18/2022 2:09 PM', "Just doin' some gardening"],
    ['7.jpg', 'Mom', '1/18/2022 9:49 AM', "I've been framed!"],
    ['6.jpg', 'Jason', '1/17/2022 9:24 PM', ''],
    ['5.jpg', 'Dad', '1/17/2022 8:44 AM', "Hello! I'm guarding the plates!"],
    ['4.jpg', 'Ryan', '1/16/2022 10:12 PM', "It's starting to feel a little hot in here..."],
    ['3.jpg', 'Dad', '1/16/2022 6:36 PM', "I hope nobody turns this thing on..."],
    ['2.jpg', 'Andrew', '1/16/2022 5:37 PM', 'Snacks! Yummm!'],
    ['1.jpg', 'Ryan', '1/15/2022 10:34 PM', "I'm pretty good at balancing :)"],
    ['0.jpg', 'Dad', '1/15/2022 11:23 PM', 'My ears are a little big...'],
]

const indexHTML = Deno.readTextFileSync('index.html');

const convertFiles = [...Deno.readDirSync('./sighting')];

const alreadyConverted = [...Deno.readDirSync('./dist/sighting')].map(v => +v.name.split('.')[0]);

const toActuallyConvert = convertFiles.filter(v => v.isFile).filter(v => !alreadyConverted.includes(+v.name.split('.')[0]));

if (toActuallyConvert.length === 0) {
    console.log("Nothing more to convert");
} else {
    console.log("Converting...")
    const process = Deno.run({
        cmd: ['mogrify', '-path', './dist/sighting', '-format', 'jpg', '-resize', '1080x1440', ...toActuallyConvert.map(v => `./sighting/${v.name}`)],
        stdout: Deno.stdout.rid,
        stderr: Deno.stderr.rid,
    })
    
    await process.status();
}

console.log("Writing html...");

const imagesHTML = metadata.map(([filename, name, datetime, text]) =>
    `<div class="image">
    <img src="sighting/${filename}" alt="${text || filename}" class="image-tag">
    <div class="alt-text">${text}</div>
    <div class="alt-text">${datetime} - found by ${name}</div>
</div>`
).join('\n')

const outputIndexHTML = indexHTML.replace(/{{IMAGES}}/, imagesHTML);

Deno.writeTextFileSync('./dist/index.html', outputIndexHTML);

if (Deno.args[0] !== '--dry') {
    console.log("Deploying...")
    const deployProcess = Deno.run({
        cmd: ['./deploy']
    });
    
    await deployProcess.status();
}
