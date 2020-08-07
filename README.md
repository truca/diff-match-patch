# README

The diff-match-patch algorithm works by calculating the differences between 2 strings and then tries to apply those differences to a third string.

In this case, the initial string is stores on the initial sync with the server and with every following sync.

That initial string is sent together with the new value to the backend, where the differences between them are computed and then applied to the value stored on the backend.

# Setup

Install packages in both folders (app and server), then run `yarn start` on both folders. Don't forget to update the URL for the server on `app/src/App.tsx` (line 17)