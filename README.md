# FinalProject

First make sure to copy the repo link in terminal using 

```
git clone [repository link] [name of folder]
``` 

Go into the repo 

```
cd [name of folder]
```

and then check the output when you type 

``` 
git status 
```

here, it should say you are on the main branch and that everything is up to date. 


To create a new branch in your name, go into the repo and 

```
git checkout -b [name]
```

When you make changes and want to send to your branch 

```
git add *
git commit -m [commit message]
git push 
```

When you want to update your branch to the current main branch 

```
git checkout main 
git pull 
git checkout [your branch name]
git merge main 
```

If you want to push your changes to the main branch, I still have to see how to do this. Will include when this is done. 

