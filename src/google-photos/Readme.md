## google photos uploader

### todo

#### implementation

the function `findPhotos` in `photolocator.js` needs to be implemented

this function takes a string that represents the starting path and should output a list of all photos under that path.

the string passed in will be somethign along the lines of `C:\Users\Annie\` and should output all photos under that path. THe reason this is done is becuase operating systems have a lot of image files we dont necessarily want to upload, such as files under `C:\Windows`

the output should be a list of objects with the format

```
{
  path: string,
  filename: string
}
```

i.e.

```
{
  path: 'C:\Users\Annie\Photos\'
  filename: 'some-photo.jpeg'
}
```

#### utilities

to implement the above function, the libraries [fs-extra](https://github.com/jprichardson/node-fs-extra) and [path](https://nodejs.org/api/path.html) will be helpful.

_fs-extra implements everything in node js [fs](https://nodejs.org/api/fs.html) so some documentation links may lead there instead of the fs-extra github page_

<details>
  <summary>fs.readDirSync</summary>
  <p>
    <code>fs.readdirSync(path[, options])</code> <a href="https://nodejs.org/api/fs.html#fs_fs_readdirsync_path_options">source</a>
    <br/><br/>
    this function returns the contents of a directory as a list of strings, for example, given a folder structure like
    <pre><code>
    C:
    |
    +-Users
     |
     +-Annie
      |
      +-Photos
       |
       +-Photo1.jpeg
       +-Photo2.jpeg
       +-SomeOtherFolder
        |
        + Photo3.jpeg
    </code></pre>
    the call <code>fs.readDirSync('C:\Users\Annie\Photos')</code> would return <code>['Photo1.jpeg', 'Photo2.jpeg', 'SomeOtherFolder']</code>
    <br/><br/>
    an option on this function is to pass in <code>{ "withFileTypes": true }</code> as the second parameter, and the function will return instances of <code>Dirent</code> instead if strings
  <br/><br/>
  this is helpful because a <code>Dirent</code> object has the functions <code>isDirectory()</code> and <code>isFile()</code> to let you know if the object is a file that is potentially a photo (strings 'Photo1.jpeg' and 'Photo2.jpeg' in the example) or a directory you need to look into for more photos (string 'SomeOtherFolder' in the example).  it also has the propery <code>name</code> that allows you to get the string that would have been returned
  <br/><br/>
    <a href='https://nodejs.org/api/fs.html#fs_class_fs_dirent'>source</a>
  <br/><br/>
    <i>additionally, this approach allows you to avoid symbolic links on a file system which you are unlikely to run into on opas comp but do exist, along with other misc things you can encounter on a file system that are not a folder or a file</i>
  </p>
</details>

<details>
  <summary>path.join</summary>
  <p>
    <code>path.join([...paths])</code> <a href='https://nodejs.org/api/path.html#path_path_join_paths'>source</a>
    <br/><br/>
    this function joins two parts of a path in the file system.  for example, given a path <code>'C:\Users\Annie'</code> and another part of the path <code>'Photos'</code> the call <code>path.join('C:\Users\Annie', 'Photos')</code> will produce the string <code>'C:\Users\Annie\Photos'</code>.  this may seem insignificant (why not just join the strings with <code>'C:\Users\Annie' + '\' + 'Photos'</code> but different operating systems have different seperators.  for example, on macos or a linux distro, the path is separated by '/' so the path would look like <code>'/home/annie'</code> and the code <code>'/home/annie' + '\' + 'photos'</code> would produce a bad path <code>'/home/annie\photos'</code>
  </p>
</details>

### npm

in a browser, there is an engine that knows how to execute the javascript on each page. to run javascript tools on a computer not in a browser, we use a tool called [nodejs](https://nodejs.org/en/). this will execute a javascript file on the command line, which is what we want to do. node also comes with a package manager called [npm](https://www.npmjs.com/). npm manages the dependencies of a project (if we want to pull in javascript that someone else wrote, we can do it with npm)

we need to do a couple things to get this project ready to execute on a given computer.

to get this project ready to run, we need to use a couple different npm commands. first we want to run `npm install`. when this is run, npm looks in the package.json for all the libraries listed, and downloads them to a folder called `node_modules`. then we need to run `npm run build`. this looks in the package.json `scripts` object for a key `build`. the commands run in that script take the javascript and typescript in the src folder and convert them all to javascript in the `lib` folder. it performs some changes to both the typescript and javascript to work on older versions of node, but for the purposes of this task you can think of it as copying.

this is a one time step that needs to be done to run the js from your maching. we need to run `npm link` from the project folder. this looks at the `bin` property in the project.json and lets the computer know that when someone types `google-photos` (or anything else listed there) it needs to execute the file at `./lib/google-photos/app.js`

to summarize, `npm install` needs to be run before anything, and `npm link` needs to be run only one time after `npm build` has been run. to test out any changes, `npm build` needs to be run first.

| Command       | Description                                                     |
| ------------- | --------------------------------------------------------------- |
| `npm install` | pulls all dependencies into `node_modules`                      |
| `npm build`   | converts ts to js and moves all to `lib`                        |
| `npm link`    | lets the computer know where to look to execute `google-photos` |

### google-photos cli

running `google-photos --help will show all options`

| Option                  | Alias | Description                                                 |
| ----------------------- | ----- | ----------------------------------------------------------- |
| `--username {username}` | `-u`  | [required] username for the google acct                     |
| `--password {password}` | `-p`  | [required] password for the google acct                     |
| `--startingpath {path}` | `-s`  | [required] path to start looking for photos                 |
| `--dryrun`              | `-d`  | indicates the file names should be printed and not uploaded |

for example

`google-photos -u username@gmail.com -p super-secret-password -s C:\Photos` will run the uploader, and `google-photos -u username@gmail.com -p super-secret-password -s C:\Photos -d` will print the files that would be uploaded.

one minor annoyance, the username, password, and startingpath cannot be 'optionally required' as far as i can tell (only required when dry run is not specified), so printing the file names doessnt need those values but they are still required
