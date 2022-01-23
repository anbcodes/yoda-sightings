try {
    Deno.removeSync('./dist', {recursive: true}); 
} catch (e) {
    if (!(e instanceof Deno.errors.NotFound)) {
        throw e;
    }
}
Deno.mkdirSync('./dist');
Deno.mkdirSync('./dist/sighting');

type Name = 'Andrew' | 'Ryan' | 'Jason' | 'Mom' | 'Dad';
type DateTime = string;
type FileName = string;
type Text = string;

const metadata: [FileName, Name, DateTime, Text][] = [
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
    ['6.jpg','Jason', '1/17/2022 9:24 PM', ''],
    ['5.jpg', 'Dad', '1/17/2022 8:44 AM', "Hello! I'm guarding the plates!"],
    ['4.jpg', 'Ryan', '1/16/2022 10:12 PM', "It's starting to feel a little hot in here..."],
    ['3.jpg', 'Dad', '1/16/2022 6:36 PM', "I hope nobody turns this thing on..."],
    ['2.jpg', 'Andrew', '1/16/2022 5:37 PM', 'Snacks! Yummm!'],
    ['1.jpg', 'Ryan', '1/15/2022 10:34 PM', "I'm pretty good at balancing :)"],
    ['0.jpg', 'Dad', '1/15/2022 11:23 PM', 'My ears are a little big...'],
]

const indexHTML = Deno.readTextFileSync('index.html');

const convertFiles = [...Deno.readDirSync('./sighting')];

const process = Deno.run({
    cmd: ['mogrify', '-path', './dist/sighting', '-format', 'jpg', '-resize', '1080x1440', ...convertFiles.filter(v => v.isFile).map(v => `./sighting/${v.name}`)],
    stdout: Deno.stdout.rid,
    stderr: Deno.stderr.rid,
})

await process.status();

const imagesHTML = metadata.map(([filename, name, datetime, text]) => 
`<div class="image">
    <img src="sighting/${filename}" alt="${text || filename}" class="image-tag">
    <div class="alt-text">${text}</div>
    <div class="alt-text">${datetime} - found by ${name}</div>
</div>`
).join('\n')

const outputIndexHTML = indexHTML.replace(/{{IMAGES}}/, imagesHTML);

Deno.writeTextFileSync('./dist/index.html', outputIndexHTML);

const deployProcess = Deno.run({
    cmd: ['./deploy']
});

await deployProcess.status();