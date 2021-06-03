# FinalProject

First make sure to copy the repo link in terminal using 

```
git clone [repository link] [name of folder]
``` 

Go into the repo 

```
cd [name of folder]
```

----------------------------------------------------------

#### To Create Your Own Branch 
```
git checkout -b nameofbranch
```

When you want to update your branch to what is in the main branch

```
git checkout main 
git pull 
git checkout nameofbranch
git merge main 
```

To check the status of your local repo

``` 
git status 
```

To switch between branches 

```
git checkout main

git checkout nameofbranch
```

### PLEASE NOTE: When you make changes, make sure you are in your own branch! 

Here, it should say you are on the main branch and that everything is up to date. 

if it does not say this, it will usually say you have made to changes to the repo and you need to push those changes. And so then you can make changes by following the instructions below. 

When you make changes and want to send to the project

```
git add *
git commit -m [commit message]
git push 
```

### To push from your local branch to the main branch 

```
git checkout master 
git pull 
git merge develop 
git push origin master
```
