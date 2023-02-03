let saveForLater = [];
let savedDetails = [];
let savedURL = [];
let likedList = [];

//if page hasn't run, define ALL localStorage, otherwise, continue with code
if (loadData('hasCodeRunBefore') === null) {
    saveData('saved', saveForLater);
    saveData('details', savedDetails);
    saveData('url', savedURL);
    saveData('like', likedList)
    saveData('hasCodeRunBefore', true);

//if page has run but was cleared on save for later page
} else if (loadData('saved') === null) {
    saveData('saved', saveForLater);
    saveData('details', savedDetails);
    saveData('url', savedURL);
} else {
    //load items already clicked and change nav icon to reflect the number of clicked bookmarks
    loadClicked();
    navSavedIcon();

    //find all bookmark icons and like icons
    const bookmark = document.querySelectorAll('.save');
    const likes = document.querySelectorAll('.like');

    //listen for clicks on all like icons
    likes.forEach(like => {
        like.addEventListener('click', e => {
            let list = e.target.classList;
            let id = e.target.id;
            let notClicked = list.contains('fa-regular');
            //if like icon was already clicked, unfill icon and remove from array
            //check if icon was clicked by checking classList for 'fa-solid'
            if (!notClicked) {
                list.remove('fa-solid');
                list.add('fa-regular');
                let index = likedList.indexOf(id)
                likedList.splice(index, 1);
            } else {
                //when like button is clicked, fill icon and add to array
                list.remove('fa-regular');
                list.add('fa-solid');
                likedList.push(id);
            }
            saveData('like', likedList);
        })
    })

    //for each bookmark icon, when clicked:
    bookmark.forEach(icon => {
        icon.addEventListener('click', e => {
            const list = e.target.classList;
            const id = e.target.id;
            //locate pathname for page the clicked icon is on
            //for later use to form link back to icon
            const url = location.pathname.split('/').pop();
            const notClicked = list.contains("fa-regular");
            
            //clicked icon is already filled, unfill it (if it contains class fa-regular, replace with fa-solid)
            //push the clicked icon id into saveForLater, save to localStorage
            if (!notClicked) {
                list.remove("fa-solid");
                list.add("fa-regular");
                
                //remove the icon, its details and url from array as its been unclicked
                let index = saveForLater.indexOf(id);
                saveForLater.splice(index, 1);
                savedDetails.splice(index, 1);
                savedURL.splice(index, 1);
            } else {
                //clicked icon isn't filled, fill it (if it contains class fa-solid, change to fa-regular)
                //push the clicked icon id into saveForLater, save to localStorage
                list.remove("fa-regular");
                list.add("fa-solid");
                saveForLater.push(id);

                let siblings = getSiblings(document.getElementById(id))
                let siblingText = siblings.map(e => e.innerHTML);
                savedDetails.push(siblingText)

                savedURL.push(url);
            };

            //update local storage
            saveData('saved', saveForLater);
            saveData('details', savedDetails);
            saveData('url', savedURL);
            
            navSavedIcon();
        })
    })
}


//change bookmark icon in nav bar
function navSavedIcon() {
    let saved = useData('saved');
    let length = saved.length;
    const bookmarkNav = document.getElementById("bookmarkNav");
        
    //if local storage has items, fill bookmark icon and add how many items vs unfill if no items
    if (length > 0) {
        bookmarkNav.innerHTML = "<i class=\"fa-solid fa-bookmark\"></i> " + length;
    } else {
        bookmarkNav.innerHTML = "<i class=\"fa-regular fa-bookmark\"></i>";
    }
}

//use local storage to change icons to filled, when previously clicked
//return clicked bookmark & like icons, details and urls data to original arrays
function loadClicked() {
    let saved = useData('saved');
    let details = useData('details');
    let urlList = useData('url');
    let liked= useData('like');
    let bookmark = document.querySelectorAll('.save');
    let likeIcon = document.querySelectorAll('.like');
    
    details.forEach(detail => {
        savedDetails.push(detail);
    })

    urlList.forEach(x => {
        savedURL.push(x);
    })

    liked.forEach(clicked => {
        likedList.push(clicked);
        //fill liked icon if the clicked id exists on loaded page
        likeIcon.forEach(like => {
            let id = like.id;
            if (clicked === id) {
                like.classList.remove('fa-regular');
                like.classList.add('fa-solid');
            }
        })
    })

    saved.forEach(clicked => {
        bookmark.forEach(icon => {
            let id = icon.id;
            //fill liked bookmark if the clicked id exists on loaded page
            if (clicked === id) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
            }
        })
        saveForLater.push(clicked);
    })
} 


// WHEN SAVE FOR LATER PAGE IS LOADED-------------------------

if (document.URL.includes('saved')) {
    let saved = useData('saved');
    let details = useData('details');
    let urls = useData('url');
    const button = document.getElementById('clear');

    //hide clear all button unless there is something saved
    if (saved.length > 0) {
        button.style.visibility = 'visible';
        button.addEventListener('click', () => {
            //on click, clear local storage and reload the page
            removeData('saved');
            removeData('url');
            removeData('details');
            location.reload();
        })
    } else {
        button.style.visibility = 'hidden';
    }
    
    //go through details array to pull information for save for later page
    for (let i = 0; i < details.length; i++) {
        //create the link HREF for each link
        let linkHREF = urls[i] + "#" + saved[i];
        let index = details[i];
        let savedPage = document.getElementById('savedPage');

        //create new elements for every link
        let link = document.createElement('a');
        let box = document.createElement('div');
        let container = document.createElement('div');
        let headBox = document.createElement('div');
        let h2 = document.createElement('h2');
        let h3 = document.createElement('h3');
        let p = document.createElement('p');
        let h3Read = document.createElement('h3');
        
        //set the classes for new elements
        box.setAttribute('class', 'back-transparent')
        container.setAttribute('class', 'containerSave');
        headBox.setAttribute('class', 'header-box');
        link.setAttribute('href', linkHREF);

        //add the new elements to the save for later page
        link.appendChild(box);
        savedPage.appendChild(link);
        box.appendChild(container);
        container.appendChild(headBox);

        //add the details from local storage
        h2.innerHTML = index[0];
        headBox.appendChild(h2);

        //continue adding details based on how many indexes are in details array
        if (index.length > 3) {
            h3.innerHTML = index[1];
            p.innerHTML = index[2];
            h3Read.innerHTML = index[3];
            headBox.appendChild(h3);
            headBox.appendChild(p);
            headBox.appendChild(h3Read);
        } else {
            p.innerHTML = index[1];
            h3Read.innerHTML = index[2];
            headBox.appendChild(p);
            headBox.appendChild(h3Read);
        }  
    }
}

//get all siblings of bookmark icon to use info on saved pages
function getSiblings(e) {
    let siblings = []; 
    if(!e.parentNode) {
        return siblings;
    }
    let sibling  = e.parentNode.firstChild;

    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== e) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
    }
    return siblings;
};

//create local storage data
function saveData (key, data) {
    let saved = localStorage.setItem(key, JSON.stringify(data));
    return saved;
}

//grab local storage
function loadData (key) {
    let saved = localStorage.getItem(key);
    return saved;
}

//return local storage to object
function useData (key) {
    let saved = JSON.parse(localStorage.getItem(key));
    return saved;
}

//remove local storage
function removeData (key) {
    let saved = localStorage.removeItem(key);
    return saved;
}