[Skip to content](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478719506/job/128725747953#start-of-content)

1. [JankesMateusz](https://github.com/JankesMateusz)
2. [TED_Tenders](https://github.com/JankesMateusz/TED_Tenders)

## Repository navigation

- [Code](https://github.com/JankesMateusz/TED_Tenders)
- [Issues](https://github.com/JankesMateusz/TED_Tenders/issues)
- [Pull requests1 (1)](https://github.com/JankesMateusz/TED_Tenders/pulls)
- [Actions](https://github.com/JankesMateusz/TED_Tenders/actions)
- [Projects](https://github.com/JankesMateusz/TED_Tenders/projects)
- [Wiki](https://github.com/JankesMateusz/TED_Tenders/wiki)
- [Security and quality](https://github.com/JankesMateusz/TED_Tenders/security)
- [Insights](https://github.com/JankesMateusz/TED_Tenders/pulse)
- [Settings](https://github.com/JankesMateusz/TED_Tenders/settings)

[Tests](https://github.com/JankesMateusz/TED_Tenders/actions/workflows/tests.yml)

# Split CI: tests on PRs, deploy develop to test and main to production #2

- [](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478719506)

#### All jobs

- - [](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478719506/job/128725747953)

- ### Run details
    
    - [](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478719506/usage)
    - [](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478719506/workflow)
    - [](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478719506/lockfile)

## Annotations

1 error, 2 warnings, and 1 notice

[tests](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478719506/job/128725747953#logs)

failed 31 minutes ago in 6m 28s

1s

1s

3s

0s

5m 40s

2s

13s

25s

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1)Run npm run test:functions

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:8)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:9)> ted-eu@0.1.0 test:functions

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:10)> npm --prefix functions run build && firebase emulators:exec --only auth,firestore,functions --project demo-tenders "node --test --test-concurrency=1 tests/invite.integration.test.mjs tests/refresh.integration.test.mjs tests/labelSnapshot.integration.test.mjs tests/docsCheck.integration.test.mjs"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:11)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:13)> functions@1.0.0 build

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:14)> tsc

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:15)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:16)i emulators: Starting emulators: auth, functions, firestore

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:17)i emulators: Detected demo project ID "demo-tenders", emulated services will use a demo configuration and attempts to access non-emulated services for this project will fail.

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:18)i firestore: Firestore Emulator logging to firestore-debug.log

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:19)✔ firestore: Firestore Emulator UI websocket is running on 9150.

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:20)i functions: Watching "/home/runner/work/TED_Tenders/TED_Tenders/functions" for Cloud Functions...

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:21)⚠ functions: package.json indicates an outdated version of firebase-functions. Please upgrade using npm install --save firebase-functions@latest in your functions directory.

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:22)⚠ functions: Please note that there will be breaking changes when you upgrade.

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:23)⚠ functions: Your requested "node" version "22" doesn't match your global version "24". Using node@24 from host.

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:24)i functions: Loaded environment variables from .env.demo-tenders.

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:25)Serving at port 8416

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:26)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:27)✔ functions: Loaded functions definitions from source: inviteUser, listUsersStatus, refreshTenders, scheduledBazaRefresh, scheduledRefresh, snapshotLabelOnStatusChange, resolveDocuments, checkDocsNow, checkDocumentsTask, enqueueDocsCheckOnCreate, enqueueDocsChecks.

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:28)✔ functions[europe-central2-inviteUser]: http function initialized ([http://127.0.0.1:5001/demo-tenders/europe-central2/inviteUser](http://127.0.0.1:5001/demo-tenders/europe-central2/inviteUser)).

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:29)✔ functions[europe-central2-listUsersStatus]: http function initialized ([http://127.0.0.1:5001/demo-tenders/europe-central2/listUsersStatus](http://127.0.0.1:5001/demo-tenders/europe-central2/listUsersStatus)).

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:30)✔ functions[europe-central2-refreshTenders]: http function initialized ([http://127.0.0.1:5001/demo-tenders/europe-central2/refreshTenders](http://127.0.0.1:5001/demo-tenders/europe-central2/refreshTenders)).

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:31)i functions[europe-central2-scheduledBazaRefresh]: function ignored because the pubsub emulator does not exist or is not running.

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:32)i functions[europe-central2-scheduledRefresh]: function ignored because the pubsub emulator does not exist or is not running.

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:33)✔ functions[europe-central2-snapshotLabelOnStatusChange]: firestore function initialized.

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:34)✔ functions[europe-central2-resolveDocuments]: http function initialized ([http://127.0.0.1:5001/demo-tenders/europe-central2/resolveDocuments](http://127.0.0.1:5001/demo-tenders/europe-central2/resolveDocuments)).

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:35)✔ functions[europe-central2-checkDocsNow]: http function initialized ([http://127.0.0.1:5001/demo-tenders/europe-central2/checkDocsNow](http://127.0.0.1:5001/demo-tenders/europe-central2/checkDocsNow)).

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:36)✔ tasks: Created queue with key: queue:demo-tenders-europe-central2-checkDocumentsTask

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:37)✔ functions[europe-central2-checkDocumentsTask]: http function initialized ([http://127.0.0.1:5001/demo-tenders/europe-central2/checkDocumentsTask](http://127.0.0.1:5001/demo-tenders/europe-central2/checkDocumentsTask)).

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:38)✔ functions[europe-central2-enqueueDocsCheckOnCreate]: firestore function initialized.

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:39)✔ functions[europe-central2-enqueueDocsChecks]: http function initialized ([http://127.0.0.1:5001/demo-tenders/europe-central2/enqueueDocsChecks](http://127.0.0.1:5001/demo-tenders/europe-central2/enqueueDocsChecks)).

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:40)i Running script: node --test --test-concurrency=1 tests/invite.integration.test.mjs tests/refresh.integration.test.mjs tests/labelSnapshot.integration.test.mjs tests/docsCheck.integration.test.mjs

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:41)▶ processDocsCheck

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:42)✔ brak dokumentów: zapisuje none, kolejkuje następne sprawdzenie +1 h (269.376525ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:43)✔ pliki się pojawiły: available z firstSeenAt, bez kolejkowania, kolejne zadania nic nie robią (52.118247ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:44)i functions: Loaded environment variables from .env.demo-tenders.

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:45)✔ ponowione zadanie tego samego sprawdzenia nie woła resolvera ani nie kolejkuje (29.810786ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:46)✔ błąd platformy to error (nie none) i zachowuje znaną platformę; sprawdzanie trwa (60.563609ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:47)✔ nieoczekiwany błąd wychodzi na zewnątrz (ponowienie przez Cloud Tasks) i niczego nie zapisuje (21.33761ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:48)✔ platforma nieobsługiwana: unsupported, bez ponawiania (26.83788ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:49)✔ ostatnie sprawdzenie bez dokumentów czyści nextCheckAt i nie kolejkuje (36.377131ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:50)✔ przetarg, którego już nie ma (TTL), jest pomijany (25.676522ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:51)✔ processDocsCheck (524.573125ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:52)▶ runManualCheck („Sprawdź teraz")

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:53)✔ przetarg bez historii dostaje normalne pierwsze sprawdzenie z harmonogramem (39.125397ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:54)✔ przetarg z historią: odświeża stan, ale nie rusza licznika ani harmonogramu (27.639017ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:55)✔ ponowne kliknięcie w ciągu minuty zwraca zapisany stan bez pytania platformy (19.082956ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:56)✔ awaria platformy nie nadpisuje znanego stanu (20.720513ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:57)✔ nieistniejący przetarg to not-found (10.799297ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:58)✔ runManualCheck („Sprawdź teraz") (118.108054ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:59)Utworzono konto admin@example.com

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:60)Użytkownik admin@example.com (nOssn3cdvIoyTjUUzDJ5YSu5sTTb) jest teraz administratorem.

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:61)i functions: Loaded environment variables from .env.demo-tenders.

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:62)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:63)⚠ External network resource requested!

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:64)- URL: "[http://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/email](http://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/email)"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:65)- Be careful, this may be a production service.

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:66)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 23.469149ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:67)i functions: Loaded environment variables from .env.demo-tenders.

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:68)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:69)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 16.401363ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:70)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:71)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 2.787233ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:72)i functions: Beginning execution of "europe-central2-inviteUser"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:73)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:74)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 2.418018ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:75)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:76)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 3.786315ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:77)> {"verifications":{"app":"MISSING","auth":"MISSING"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:78)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:79)i functions: Finished "europe-central2-inviteUser" in 14.428446ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:80)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 2.449434ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:81)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:82)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 2.090925ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:83)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:84)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 2.265498ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:85)▶ inviteUser

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:86)✔ odrzuca niezalogowanego (875.764483ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:87)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:88)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 11.840742ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:89)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:90)i functions: Beginning execution of "europe-central2-inviteUser"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:91)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 5.875488ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:92)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:93)i functions: Finished "europe-central2-inviteUser" in 3.519404ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:94)✔ odrzuca zalogowanego bez roli admina (34.104794ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:95)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:96)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 4.698739ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:97)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:98)i functions: Beginning execution of "europe-central2-inviteUser"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:99)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 5.882299ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:100)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:101)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:102)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 3.261567ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:103)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:104)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 1.612285ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:105)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:106)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 4.120979ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:107)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:108)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 2.447762ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:109)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:110)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 2.262223ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:111)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:112)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 6.191765ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:113)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:114)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 1.273325ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:115)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:116)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 1.70818ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:117)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:118)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 1.080545ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:119)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:120)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 1.340697ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:121)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:122)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 3.248697ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:123)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:124)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 1.602149ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:125)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:126)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 1.204682ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:127)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:128)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 1.266405ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:129)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:130)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 1.148408ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:131)i functions: Loaded environment variables from .env.demo-tenders.

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:132)i functions: Finished "europe-central2-inviteUser" in 170.775587ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:133)✔ admin zaprasza nową osobę i dostaje link (191.80997ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:134)i functions: Beginning execution of "europe-central2-inviteUser"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:135)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:136)i functions: Finished "europe-central2-inviteUser" in 12.672203ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:137)✔ ponowne zaproszenie daje nowy link i nie zmienia roli (15.171252ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:138)i functions: Beginning execution of "europe-central2-inviteUser"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:139)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:140)i functions: Finished "europe-central2-inviteUser" in 12.448166ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:141)✔ zaproszenie admina nie obniża jego roli (16.700152ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:142)i functions: Beginning execution of "europe-central2-inviteUser"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:143)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:144)i functions: Finished "europe-central2-inviteUser" in 3.34398ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:145)i functions: Beginning execution of "europe-central2-inviteUser"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:146)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:147)i functions: Finished "europe-central2-inviteUser" in 1.69462ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:148)✔ odrzuca nieprawidłowy adres email (8.878886ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:149)✔ inviteUser (1144.483849ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:150)i functions: Loaded environment variables from .env.demo-tenders.

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:151)i functions: Beginning execution of "europe-central2-checkDocumentsTask"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:152)i functions: Beginning execution of "europe-central2-listUsersStatus"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:153)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:154)i functions: Finished "europe-central2-listUsersStatus" in 27.751967ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:155)▶ listUsersStatus

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:156)✔ odrzuca zalogowanego bez roli admina (753.386098ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:157)i functions: Beginning execution of "europe-central2-listUsersStatus"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:158)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:159)i functions: Finished "europe-central2-listUsersStatus" in 15.700058ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:160)✔ admin widzi statusy aktywacji tylko użytkowników z rolą (30.687763ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:161)✔ listUsersStatus (785.079484ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:162)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:163)i functions: Finished "europe-central2-checkDocumentsTask" in 206.513558ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:164)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 3.515568ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:165)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:166)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 2.192148ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:167)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:168)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 1.589311ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:169)▶ snapshotLabelOnStatusChange

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:170)✔ zmiana etykiet nie tworzy migawki (2521.224486ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:171)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:172)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 141.742054ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:173)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:174)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 14.907245ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:175)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:176)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 14.991963ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:177)✔ ustawienie, zmiana i zdjęcie statusu dopisują historię, a migawka zostaje (666.62796ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:178)✔ migawka przetrwa usunięcie przetargu (TTL) (1015.287136ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:179)✔ snapshotLabelOnStatusChange (4357.527427ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:180)Użytkownik admin@example.com (nOssn3cdvIoyTjUUzDJ5YSu5sTTb) jest teraz administratorem.

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:181)i functions: Loaded environment variables from .env.demo-tenders.

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:182)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:183)> {"verifications":{"app":"MISSING","auth":"MISSING"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:184)i functions: Finished "europe-central2-refreshTenders" in 9.866834ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:185)▶ refreshTenders

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:186)✔ odrzuca niezalogowanego (tryb otwarty: konto bez roli jest dopuszczone) (745.471529ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:187)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:188)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:189)i functions: Finished "europe-central2-refreshTenders" in 2.449918ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:190)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:191)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:192)i functions: Finished "europe-central2-refreshTenders" in 1.593098ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:193)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:194)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:195)i functions: Finished "europe-central2-refreshTenders" in 1.475851ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:196)✔ odrzuca nieprawidłowe daty (23.911715ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:197)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:198)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:199)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:200)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 10.325253ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:201)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:202)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 7.75846ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:203)i functions: Finished "europe-central2-refreshTenders" in 196.994592ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:204)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:205)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 4.990342ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:206)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:207)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 4.033301ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:208)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:209)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 4.236146ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:210)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:211)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 3.863096ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:212)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:213)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 4.500896ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:214)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:215)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 3.860031ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:216)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:217)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 3.601181ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:218)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:219)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 3.325426ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:220)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:221)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 3.552588ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:222)i functions: Beginning execution of "europe-central2-checkDocumentsTask"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:223)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:224)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 4.655337ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:225)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:226)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 6.934609ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:227)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:228)i functions: Finished "europe-central2-checkDocumentsTask" in 19.727225ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:229)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 3.422321ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:230)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:231)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 3.196763ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:232)✖ zapisuje przetargi z obu źródeł, z drugą stroną i bez ogłoszeń zmieniających oraz z innych dni (414.10171ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:233)✔ zapisuje poprawny dokument z datą wygaśnięcia po miesiącu (13.685922ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:234)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:235)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:236)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:237)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 22.112487ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:238)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:239)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 5.271034ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:240)i functions: Finished "europe-central2-refreshTenders" in 48.776895ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:241)✖ przy ponownym odświeżeniu dopisuje tylko nowe i nie rusza istniejących (status zostaje) (86.777499ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:242)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:243)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:244)> Błąd pobierania przetargów z TED: AxiosError: Request failed with status code 500

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:245)> at settle (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:2049:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:246)> at IncomingMessage.handleStreamEnd (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:3166:11)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:247)> at IncomingMessage.emit (node:events:526:24)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:248)> at endReadableNT (node:internal/streams/readable:1783:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:249)> at process.processTicksAndRejections (node:internal/process/task_queues:90:21)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:250)> at Axios.request (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:4276:41)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:251)> at process.processTicksAndRejections (node:internal/process/task_queues:104:5)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:252)> at async requestWithRetry (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/http.js:29:20)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:253)> at async Object.fetchTed [as TED] (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/ted.js:123:30)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:254)> at async Promise.all (index 0)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:255)> at async refreshDay (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/refresh.js:95:25)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:256)> at async /home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/firebase-functions/lib/common/providers/https.js:544:26

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:257)> at async runFunction (/home/runner/work/TED_Tenders/TED_Tenders/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js:506:9)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:258)> at async runHTTPS (/home/runner/work/TED_Tenders/TED_Tenders/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js:531:5)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:259)> at async /home/runner/work/TED_Tenders/TED_Tenders/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js:694:21 {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:260)> code: 'ERR_BAD_RESPONSE',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:261)> config: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:262)> transitional: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:263)> silentJSONParsing: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:264)> forcedJSONParsing: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:265)> clarifyTimeoutError: false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:266)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:267)> adapter: [ 'xhr', 'http', 'fetch' ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:268)> transformRequest: [ [Function: transformRequest] ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:269)> transformResponse: [ [Function: transformResponse] ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:270)> timeout: 30000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:271)> xsrfCookieName: 'XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:272)> xsrfHeaderName: 'X-XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:273)> maxContentLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:274)> maxBodyLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:275)> env: { FormData: [Function [FormData]], Blob: [class Blob] },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:276)> validateStatus: [Function: validateStatus],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:277)> headers: Object [AxiosHeaders] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:278)> Accept: 'application/json, text/plain, */*',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:279)> 'Content-Type': 'application/json',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:280)> 'User-Agent': 'axios/1.9.0',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:281)> 'Content-Length': '422',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:282)> 'Accept-Encoding': 'gzip, compress, deflate, br'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:283)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:284)> method: 'post',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:285)> url: '[http://127.0.0.1:9199/ted](http://127.0.0.1:9199/ted)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:286)> data: '{"query":"buyer-country=POL AND publication-date=20261108 AND classification-cpv=teeq AND notice-type=cn-standard","fields":["notice-title","classification-cpv","publication-date","publication-number","buyer-city","organisation-name-buyer","authority-main-activity","contract-nature","change-notice-version-identifier","deadline-receipt-tender-date-lot","document-url-lot","internal-identifier-proc"],"page":1,"limit":250}',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:287)> allowAbsoluteUrls: true

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:288)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:289)> request: <ref *1> ClientRequest {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:290)> _events: [Object: null prototype] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:291)> abort: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:292)> aborted: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:293)> connect: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:294)> error: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:295)> socket: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:296)> timeout: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:297)> finish: [Function: requestOnFinish]

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:298)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:299)> _eventsCount: 7,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:300)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:301)> outputData: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:302)> outputSize: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:303)> writable: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:304)> destroyed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:305)> _last: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:306)> chunkedEncoding: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:307)> shouldKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:308)> maxRequestsOnConnectionReached: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:309)> _defaultKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:310)> useChunkedEncodingByDefault: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:311)> sendDate: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:312)> _removedConnection: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:313)> _removedContLen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:314)> _removedTE: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:315)> strictContentLength: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:316)> _contentLength: 422,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:317)> _hasBody: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:318)> _trailer: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:319)> finished: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:320)> _headerSent: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:321)> _closed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:322)> _header: 'POST /ted HTTP/1.1\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:323)> 'Accept: application/json, text/plain, */*\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:324)> 'Content-Type: application/json\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:325)> 'User-Agent: axios/1.9.0\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:326)> 'Content-Length: 422\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:327)> 'Accept-Encoding: gzip, compress, deflate, br\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:328)> 'Host: 127.0.0.1:9199\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:329)> 'Connection: keep-alive\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:330)> '\r\n',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:331)> _keepAliveTimeout: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:332)> _onPendingData: [Function: nop],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:333)> agent: Agent {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:334)> _events: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:335)> _eventsCount: 2,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:336)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:337)> options: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:338)> defaultPort: 80,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:339)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:340)> requests: [Object: null prototype] {},

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:341)> sockets: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:342)> freeSockets: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:343)> keepAliveMsecs: 1000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:344)> keepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:345)> maxSockets: Infinity,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:346)> maxFreeSockets: 256,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:347)> scheduling: 'lifo',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:348)> maxTotalSockets: Infinity,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:349)> totalSocketCount: 4,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:350)> agentKeepAliveTimeoutBuffer: 1000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:351)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:352)> Symbol(kCapture): false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:353)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:354)> socketPath: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:355)> method: 'POST',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:356)> maxHeaderSize: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:357)> insecureHTTPParser: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:358)> httpValidation: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:359)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:360)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:361)> res: IncomingMessage {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:362)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:363)> _readableState: [ReadableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:364)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:365)> socket: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:366)> httpVersionMajor: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:367)> httpVersionMinor: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:368)> httpVersion: '1.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:369)> complete: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:370)> rawHeaders: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:371)> rawTrailers: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:372)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:373)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:374)> upgrade: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:375)> url: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:376)> method: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:377)> statusCode: 500,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:378)> statusMessage: 'Internal Server Error',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:379)> client: [Socket],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:380)> _consuming: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:381)> _dumped: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:382)> req: [Circular *1],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:383)> _eventsCount: 4,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:384)> responseUrl: '[http://127.0.0.1:9199/ted](http://127.0.0.1:9199/ted)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:385)> redirects: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:386)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:387)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:388)> Symbol(kHeaders): [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:389)> Symbol(kHeadersCount): 10,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:390)> Symbol(kTrailers): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:391)> Symbol(kTrailersCount): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:392)> Symbol(kAbortController): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:393)> Symbol(kAbortSignalSocket): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:394)> Symbol(kAbortSignalListener): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:395)> Symbol(kAbortSignalDetached): true

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:396)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:397)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:398)> timeoutCb: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:399)> upgradeOrConnect: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:400)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:401)> maxHeadersCount: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:402)> reusedSocket: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:403)> host: '127.0.0.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:404)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:405)> _redirectable: Writable {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:406)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:407)> _writableState: [WritableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:408)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:409)> _options: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:410)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:411)> _ending: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:412)> _redirectCount: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:413)> _redirects: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:414)> _requestBodyLength: 422,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:415)> _requestBodyBuffers: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:416)> _eventsCount: 3,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:417)> _onNativeResponse: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:418)> _currentRequest: [Circular *1],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:419)> _currentUrl: '[http://127.0.0.1:9199/ted](http://127.0.0.1:9199/ted)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:420)> _timeout: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:421)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:422)> Symbol(kCapture): false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:423)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:424)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:425)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:426)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:427)> Symbol(kNeedDrain): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:428)> Symbol(corked): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:429)> Symbol(kChunkedBuffer): [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:430)> Symbol(kChunkedLength): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:431)> Symbol(kSocket): Socket {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:432)> connecting: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:433)> _hadError: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:434)> _parent: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:435)> _host: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:436)> _closeAfterHandlingError: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:437)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:438)> _readableState: [ReadableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:439)> _writableState: [WritableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:440)> allowHalfOpen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:441)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:442)> _eventsCount: 6,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:443)> _sockname: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:444)> _pendingData: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:445)> _pendingEncoding: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:446)> server: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:447)> _server: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:448)> timeout: 4000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:449)> _httpMessage: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:450)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:451)> Symbol(async_id_symbol): -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:452)> Symbol(kHandle): [TCP],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:453)> Symbol(lastWriteQueueSize): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:454)> Symbol(timeout): Timeout {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:455)> _idleTimeout: 4000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:456)> _idlePrev: [TimersList],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:457)> _idleNext: [TimersList],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:458)> _idleStart: 1278,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:459)> _onTimeout: [Function: onStreamTimeout],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:460)> _timerArgs: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:461)> _repeat: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:462)> _destroyed: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:463)> Symbol(refed): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:464)> Symbol(kHasPrimitive): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:465)> Symbol(asyncId): 1253,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:466)> Symbol(triggerId): 1251,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:467)> Symbol(kAsyncContextFrame): undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:468)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:469)> Symbol(kBuffer): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:470)> Symbol(kBufferCb): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:471)> Symbol(kBufferGen): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:472)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:473)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:474)> Symbol(kSetNoDelay): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:475)> Symbol(kSetKeepAlive): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:476)> Symbol(kSetKeepAliveInitialDelay): 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:477)> Symbol(kSetTOS): undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:478)> Symbol(kBytesRead): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:479)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:480)> Symbol(kSetKeepAliveInterval): undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:481)> Symbol(kSetKeepAliveCount): undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:482)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:483)> Symbol(kOutHeaders): [Object: null prototype] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:484)> accept: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:485)> 'content-type': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:486)> 'user-agent': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:487)> 'content-length': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:488)> 'accept-encoding': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:489)> host: [Array]

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:490)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:491)> Symbol(errored): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:492)> Symbol(kWritableFinished): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:493)> Symbol(kEndCallbacks): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:494)> Symbol(kFlushError): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:495)> Symbol(kHighWaterMark): 65536,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:496)> Symbol(kRejectNonStandardBodyWrites): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:497)> Symbol(kPath): '/ted',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:498)> Symbol(kProxyRewrittenToAbsolute): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:499)> Symbol(kAuthority): '127.0.0.1:9199',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:500)> Symbol(kUniqueHeaders): null

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:501)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:502)> response: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:503)> status: 500,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:504)> statusText: 'Internal Server Error',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:505)> headers: Object [AxiosHeaders] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:506)> 'content-type': 'application/json',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:507)> date: 'Sun, 08 Nov 2026 12:13:24 GMT',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:508)> connection: 'keep-alive',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:509)> 'keep-alive': 'timeout=5',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:510)> 'transfer-encoding': 'chunked'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:511)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:512)> config: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:513)> transitional: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:514)> adapter: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:515)> transformRequest: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:516)> transformResponse: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:517)> timeout: 30000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:518)> xsrfCookieName: 'XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:519)> xsrfHeaderName: 'X-XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:520)> maxContentLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:521)> maxBodyLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:522)> env: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:523)> validateStatus: [Function: validateStatus],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:524)> headers: [Object [AxiosHeaders]],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:525)> method: 'post',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:526)> url: '[http://127.0.0.1:9199/ted](http://127.0.0.1:9199/ted)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:527)> data: '{"query":"buyer-country=POL AND publication-date=20261108 AND classification-cpv=teeq AND notice-type=cn-standard","fields":["notice-title","classification-cpv","publication-date","publication-number","buyer-city","organisation-name-buyer","authority-main-activity","contract-nature","change-notice-version-identifier","deadline-receipt-tender-date-lot","document-url-lot","internal-identifier-proc"],"page":1,"limit":250}',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:528)> allowAbsoluteUrls: true

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:529)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:530)> request: <ref *1> ClientRequest {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:531)> _events: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:532)> _eventsCount: 7,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:533)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:534)> outputData: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:535)> outputSize: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:536)> writable: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:537)> destroyed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:538)> _last: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:539)> chunkedEncoding: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:540)> shouldKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:541)> maxRequestsOnConnectionReached: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:542)> _defaultKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:543)> useChunkedEncodingByDefault: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:544)> sendDate: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:545)> _removedConnection: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:546)> _removedContLen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:547)> _removedTE: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:548)> strictContentLength: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:549)> _contentLength: 422,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:550)> _hasBody: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:551)> _trailer: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:552)> finished: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:553)> _headerSent: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:554)> _closed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:555)> _header: 'POST /ted HTTP/1.1\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:556)> 'Accept: application/json, text/plain, */*\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:557)> 'Content-Type: application/json\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:558)> 'User-Agent: axios/1.9.0\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:559)> 'Content-Length: 422\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:560)> 'Accept-Encoding: gzip, compress, deflate, br\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:561)> 'Host: 127.0.0.1:9199\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:562)> 'Connection: keep-alive\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:563)> '\r\n',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:564)> _keepAliveTimeout: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:565)> _onPendingData: [Function: nop],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:566)> agent: [Agent],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:567)> socketPath: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:568)> method: 'POST',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:569)> maxHeaderSize: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:570)> insecureHTTPParser: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:571)> httpValidation: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:572)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:573)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:574)> res: [IncomingMessage],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:575)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:576)> timeoutCb: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:577)> upgradeOrConnect: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:578)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:579)> maxHeadersCount: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:580)> reusedSocket: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:581)> host: '127.0.0.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:582)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:583)> _redirectable: [Writable],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:584)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:585)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:586)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:587)> Symbol(kNeedDrain): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:588)> Symbol(corked): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:589)> Symbol(kChunkedBuffer): [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:590)> Symbol(kChunkedLength): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:591)> Symbol(kSocket): [Socket],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:592)> Symbol(kOutHeaders): [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:593)> Symbol(errored): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:594)> Symbol(kWritableFinished): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:595)> Symbol(kEndCallbacks): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:596)> Symbol(kFlushError): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:597)> Symbol(kHighWaterMark): 65536,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:598)> Symbol(kRejectNonStandardBodyWrites): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:599)> Symbol(kPath): '/ted',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:600)> Symbol(kProxyRewrittenToAbsolute): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:601)> Symbol(kAuthority): '127.0.0.1:9199',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:602)> Symbol(kUniqueHeaders): null

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:603)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:604)> data: { error: 'boom' }

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:605)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:606)> status: 500

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:607)> }

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:608)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:609)✔ przy awarii jednego źródła zapisuje drugie i zgłasza błąd (56.129744ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:610)i functions: Finished "europe-central2-refreshTenders" in 53.588849ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:611)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:612)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:613)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 9.112226ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:614)> Błąd pobierania przetargów z TED: AxiosError: Request failed with status code 500

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:615)> at settle (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:2049:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:616)> at IncomingMessage.handleStreamEnd (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:3166:11)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:617)> at IncomingMessage.emit (node:events:526:24)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:618)> at endReadableNT (node:internal/streams/readable:1783:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:619)> at process.processTicksAndRejections (node:internal/process/task_queues:90:21)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:620)> at Axios.request (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:4276:41)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:621)> at process.processTicksAndRejections (node:internal/process/task_queues:104:5)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:622)> at async requestWithRetry (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/http.js:29:20)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:623)> at async Object.fetchTed [as TED] (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/ted.js:123:30)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:624)> at async Promise.all (index 0)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:625)> at async refreshDay (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/refresh.js:95:25)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:626)> at async /home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/firebase-functions/lib/common/providers/https.js:544:26

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:627)> at async runFunction (/home/runner/work/TED_Tenders/TED_Tenders/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js:506:9)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:628)> at async runHTTPS (/home/runner/work/TED_Tenders/TED_Tenders/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js:531:5)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:629)> at async /home/runner/work/TED_Tenders/TED_Tenders/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js:694:21 {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:630)> code: 'ERR_BAD_RESPONSE',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:631)> config: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:632)> transitional: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:633)> silentJSONParsing: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:634)> forcedJSONParsing: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:635)> clarifyTimeoutError: false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:636)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:637)> adapter: [ 'xhr', 'http', 'fetch' ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:638)> transformRequest: [ [Function: transformRequest] ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:639)> transformResponse: [ [Function: transformResponse] ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:640)> timeout: 30000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:641)> xsrfCookieName: 'XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:642)> xsrfHeaderName: 'X-XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:643)> maxContentLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:644)> maxBodyLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:645)> env: { FormData: [Function [FormData]], Blob: [class Blob] },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:646)> validateStatus: [Function: validateStatus],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:647)> headers: Object [AxiosHeaders] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:648)> Accept: 'application/json, text/plain, */*',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:649)> 'Content-Type': 'application/json',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:650)> 'User-Agent': 'axios/1.9.0',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:651)> 'Content-Length': '422',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:652)> 'Accept-Encoding': 'gzip, compress, deflate, br'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:653)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:654)> method: 'post',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:655)> url: '[http://127.0.0.1:9199/ted](http://127.0.0.1:9199/ted)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:656)> data: '{"query":"buyer-country=POL AND publication-date=20261108 AND classification-cpv=teeq AND notice-type=cn-standard","fields":["notice-title","classification-cpv","publication-date","publication-number","buyer-city","organisation-name-buyer","authority-main-activity","contract-nature","change-notice-version-identifier","deadline-receipt-tender-date-lot","document-url-lot","internal-identifier-proc"],"page":1,"limit":250}',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:657)> allowAbsoluteUrls: true

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:658)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:659)> request: <ref *1> ClientRequest {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:660)> _events: [Object: null prototype] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:661)> abort: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:662)> aborted: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:663)> connect: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:664)> error: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:665)> socket: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:666)> timeout: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:667)> finish: [Function: requestOnFinish]

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:668)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:669)> _eventsCount: 7,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:670)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:671)> outputData: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:672)> outputSize: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:673)> writable: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:674)> destroyed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:675)> _last: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:676)> chunkedEncoding: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:677)> shouldKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:678)> maxRequestsOnConnectionReached: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:679)> _defaultKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:680)> useChunkedEncodingByDefault: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:681)> sendDate: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:682)> _removedConnection: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:683)> _removedContLen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:684)> _removedTE: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:685)> strictContentLength: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:686)> _contentLength: 422,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:687)> _hasBody: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:688)> _trailer: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:689)> finished: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:690)> _headerSent: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:691)> _closed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:692)> _header: 'POST /ted HTTP/1.1\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:693)> 'Accept: application/json, text/plain, */*\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:694)> 'Content-Type: application/json\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:695)> 'User-Agent: axios/1.9.0\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:696)> 'Content-Length: 422\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:697)> 'Accept-Encoding: gzip, compress, deflate, br\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:698)> 'Host: 127.0.0.1:9199\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:699)> 'Connection: keep-alive\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:700)> '\r\n',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:701)> _keepAliveTimeout: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:702)> _onPendingData: [Function: nop],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:703)> agent: Agent {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:704)> _events: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:705)> _eventsCount: 2,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:706)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:707)> options: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:708)> defaultPort: 80,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:709)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:710)> requests: [Object: null prototype] {},

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:711)> sockets: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:712)> freeSockets: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:713)> keepAliveMsecs: 1000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:714)> keepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:715)> maxSockets: Infinity,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:716)> maxFreeSockets: 256,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:717)> scheduling: 'lifo',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:718)> maxTotalSockets: Infinity,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:719)> totalSocketCount: 4,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:720)> agentKeepAliveTimeoutBuffer: 1000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:721)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:722)> Symbol(kCapture): false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:723)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:724)> socketPath: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:725)> method: 'POST',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:726)> maxHeaderSize: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:727)> insecureHTTPParser: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:728)> httpValidation: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:729)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:730)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:731)> res: IncomingMessage {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:732)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:733)> _readableState: [ReadableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:734)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:735)> socket: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:736)> httpVersionMajor: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:737)> httpVersionMinor: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:738)> httpVersion: '1.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:739)> complete: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:740)> rawHeaders: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:741)> rawTrailers: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:742)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:743)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:744)> upgrade: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:745)> url: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:746)> method: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:747)> statusCode: 500,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:748)> statusMessage: 'Internal Server Error',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:749)> client: [Socket],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:750)> _consuming: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:751)> _dumped: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:752)> req: [Circular *1],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:753)> _eventsCount: 4,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:754)> responseUrl: '[http://127.0.0.1:9199/ted](http://127.0.0.1:9199/ted)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:755)> redirects: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:756)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:757)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:758)> Symbol(kHeaders): [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:759)> Symbol(kHeadersCount): 10,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:760)> Symbol(kTrailers): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:761)> Symbol(kTrailersCount): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:762)> Symbol(kAbortController): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:763)> Symbol(kAbortSignalSocket): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:764)> Symbol(kAbortSignalListener): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:765)> Symbol(kAbortSignalDetached): true

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:766)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:767)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:768)> timeoutCb: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:769)> upgradeOrConnect: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:770)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:771)> maxHeadersCount: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:772)> reusedSocket: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:773)> host: '127.0.0.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:774)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:775)> _redirectable: Writable {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:776)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:777)> _writableState: [WritableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:778)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:779)> _options: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:780)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:781)> _ending: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:782)> _redirectCount: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:783)> _redirects: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:784)> _requestBodyLength: 422,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:785)> _requestBodyBuffers: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:786)> _eventsCount: 3,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:787)> _onNativeResponse: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:788)> _currentRequest: [Circular *1],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:789)> _currentUrl: '[http://127.0.0.1:9199/ted](http://127.0.0.1:9199/ted)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:790)> _timeout: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:791)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:792)> Symbol(kCapture): false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:793)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:794)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:795)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:796)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:797)> Symbol(kNeedDrain): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:798)> Symbol(corked): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:799)> Symbol(kChunkedBuffer): [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:800)> Symbol(kChunkedLength): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:801)> Symbol(kSocket): Socket {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:802)> connecting: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:803)> _hadError: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:804)> _parent: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:805)> _host: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:806)> _closeAfterHandlingError: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:807)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:808)> _readableState: [ReadableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:809)> _writableState: [WritableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:810)> allowHalfOpen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:811)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:812)> _eventsCount: 6,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:813)> _sockname: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:814)> _pendingData: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:815)> _pendingEncoding: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:816)> server: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:817)> _server: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:818)> timeout: 4000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:819)> _httpMessage: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:820)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:821)> Symbol(async_id_symbol): -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:822)> Symbol(kHandle): [TCP],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:823)> Symbol(lastWriteQueueSize): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:824)> Symbol(timeout): Timeout {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:825)> _idleTimeout: 4000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:826)> _idlePrev: [TimersList],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:827)> _idleNext: [TimersList],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:828)> _idleStart: 1337,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:829)> _onTimeout: [Function: onStreamTimeout],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:830)> _timerArgs: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:831)> _repeat: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:832)> _destroyed: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:833)> Symbol(refed): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:834)> Symbol(kHasPrimitive): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:835)> Symbol(asyncId): 1675,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:836)> Symbol(triggerId): 1673,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:837)> Symbol(kAsyncContextFrame): undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:838)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:839)> Symbol(kBuffer): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:840)> Symbol(kBufferCb): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:841)> Symbol(kBufferGen): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:842)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:843)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:844)> Symbol(kSetNoDelay): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:845)> Symbol(kSetKeepAlive): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:846)> Symbol(kSetKeepAliveInitialDelay): 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:847)> Symbol(kSetTOS): undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:848)> Symbol(kBytesRead): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:849)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:850)> Symbol(kSetKeepAliveInterval): undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:851)> Symbol(kSetKeepAliveCount): undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:852)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:853)> Symbol(kOutHeaders): [Object: null prototype] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:854)> accept: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:855)> 'content-type': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:856)> 'user-agent': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:857)> 'content-length': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:858)> 'accept-encoding': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:859)> host: [Array]

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:860)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:861)> Symbol(errored): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:862)> Symbol(kWritableFinished): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:863)> Symbol(kEndCallbacks): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:864)> Symbol(kFlushError): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:865)> Symbol(kHighWaterMark): 65536,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:866)> Symbol(kRejectNonStandardBodyWrites): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:867)> Symbol(kPath): '/ted',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:868)> Symbol(kProxyRewrittenToAbsolute): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:869)> Symbol(kAuthority): '127.0.0.1:9199',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:870)> Symbol(kUniqueHeaders): null

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:871)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:872)> response: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:873)> status: 500,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:874)> statusText: 'Internal Server Error',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:875)> headers: Object [AxiosHeaders] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:876)> 'content-type': 'application/json',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:877)> date: 'Sun, 08 Nov 2026 12:13:24 GMT',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:878)> connection: 'keep-alive',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:879)> 'keep-alive': 'timeout=5',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:880)> 'transfer-encoding': 'chunked'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:881)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:882)> config: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:883)> transitional: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:884)> adapter: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:885)> transformRequest: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:886)> transformResponse: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:887)> timeout: 30000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:888)> xsrfCookieName: 'XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:889)> xsrfHeaderName: 'X-XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:890)> maxContentLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:891)> maxBodyLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:892)> env: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:893)> validateStatus: [Function: validateStatus],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:894)> headers: [Object [AxiosHeaders]],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:895)> method: 'post',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:896)> url: '[http://127.0.0.1:9199/ted](http://127.0.0.1:9199/ted)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:897)> data: '{"query":"buyer-country=POL AND publication-date=20261108 AND classification-cpv=teeq AND notice-type=cn-standard","fields":["notice-title","classification-cpv","publication-date","publication-number","buyer-city","organisation-name-buyer","authority-main-activity","contract-nature","change-notice-version-identifier","deadline-receipt-tender-date-lot","document-url-lot","internal-identifier-proc"],"page":1,"limit":250}',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:898)> allowAbsoluteUrls: true

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:899)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:900)> request: <ref *1> ClientRequest {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:901)> _events: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:902)> _eventsCount: 7,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:903)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:904)> outputData: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:905)> outputSize: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:906)> writable: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:907)> destroyed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:908)> _last: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:909)> chunkedEncoding: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:910)> shouldKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:911)> maxRequestsOnConnectionReached: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:912)> _defaultKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:913)> useChunkedEncodingByDefault: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:914)> sendDate: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:915)> _removedConnection: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:916)> _removedContLen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:917)> _removedTE: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:918)> strictContentLength: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:919)> _contentLength: 422,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:920)> _hasBody: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:921)> _trailer: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:922)> finished: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:923)> _headerSent: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:924)> _closed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:925)> _header: 'POST /ted HTTP/1.1\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:926)> 'Accept: application/json, text/plain, */*\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:927)> 'Content-Type: application/json\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:928)> 'User-Agent: axios/1.9.0\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:929)> 'Content-Length: 422\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:930)> 'Accept-Encoding: gzip, compress, deflate, br\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:931)> 'Host: 127.0.0.1:9199\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:932)> 'Connection: keep-alive\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:933)> '\r\n',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:934)> _keepAliveTimeout: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:935)> _onPendingData: [Function: nop],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:936)> agent: [Agent],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:937)> socketPath: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:938)> method: 'POST',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:939)> maxHeaderSize: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:940)> insecureHTTPParser: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:941)> httpValidation: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:942)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:943)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:944)> res: [IncomingMessage],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:945)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:946)> timeoutCb: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:947)> upgradeOrConnect: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:948)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:949)> maxHeadersCount: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:950)> reusedSocket: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:951)> host: '127.0.0.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:952)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:953)> _redirectable: [Writable],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:954)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:955)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:956)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:957)> Symbol(kNeedDrain): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:958)> Symbol(corked): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:959)> Symbol(kChunkedBuffer): [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:960)> Symbol(kChunkedLength): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:961)> Symbol(kSocket): [Socket],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:962)> Symbol(kOutHeaders): [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:963)> Symbol(errored): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:964)> Symbol(kWritableFinished): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:965)> Symbol(kEndCallbacks): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:966)> Symbol(kFlushError): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:967)> Symbol(kHighWaterMark): 65536,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:968)> Symbol(kRejectNonStandardBodyWrites): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:969)> Symbol(kPath): '/ted',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:970)> Symbol(kProxyRewrittenToAbsolute): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:971)> Symbol(kAuthority): '127.0.0.1:9199',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:972)> Symbol(kUniqueHeaders): null

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:973)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:974)> data: { error: 'boom' }

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:975)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:976)> status: 500

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:977)> }

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:978)> Błąd pobierania przetargów z eZamówień (Delivery): AxiosError: Request failed with status code 500

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:979)> at settle (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:2049:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:980)> at IncomingMessage.handleStreamEnd (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:3166:11)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:981)> at IncomingMessage.emit (node:events:526:24)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:982)> at endReadableNT (node:internal/streams/readable:1783:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:983)> at process.processTicksAndRejections (node:internal/process/task_queues:90:21)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:984)> at Axios.request (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:4276:41)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:985)> at process.processTicksAndRejections (node:internal/process/task_queues:104:5)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:986)> at async requestWithRetry (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/http.js:29:20)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:987)> at async fetchOrderType (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/ezamowienia.js:64:26)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:988)> at async Promise.allSettled (index 0)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:989)> at async Object.fetchEzamowienia [as E_ZAMOWIENIA] (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/ezamowienia.js:101:21)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:990)> at async Promise.all (index 1)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:991)> at async refreshDay (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/refresh.js:95:25)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:992)> at async /home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/firebase-functions/lib/common/providers/https.js:544:26

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:993)> at async runFunction (/home/runner/work/TED_Tenders/TED_Tenders/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js:506:9) {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:994)> code: 'ERR_BAD_RESPONSE',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:995)> config: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:996)> transitional: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:997)> silentJSONParsing: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:998)> forcedJSONParsing: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:999)> clarifyTimeoutError: false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1000)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1001)> adapter: [ 'xhr', 'http', 'fetch' ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1002)> transformRequest: [ [Function: transformRequest] ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1003)> transformResponse: [ [Function: transformResponse] ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1004)> timeout: 30000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1005)> xsrfCookieName: 'XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1006)> xsrfHeaderName: 'X-XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1007)> maxContentLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1008)> maxBodyLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1009)> env: { FormData: [Function [FormData]], Blob: [class Blob] },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1010)> validateStatus: [Function: validateStatus],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1011)> headers: Object [AxiosHeaders] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1012)> Accept: 'application/json, text/plain, */*',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1013)> 'Content-Type': undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1014)> 'User-Agent': 'axios/1.9.0',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1015)> 'Accept-Encoding': 'gzip, compress, deflate, br'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1016)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1017)> method: 'get',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1018)> url: '[http://127.0.0.1:9199/ezamowienia](http://127.0.0.1:9199/ezamowienia)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1019)> params: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1020)> noticeType: 'ContractNotice',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1021)> isTenderAmountBelowEU: 'true',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1022)> publicationDateFrom: '2026-11-07',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1023)> publicationDateTo: '2026-11-08',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1024)> orderType: 'Delivery',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1025)> SortingColumnName: 'PublicationDate',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1026)> SortingDirection: 'DESC',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1027)> PageNumber: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1028)> PageSize: 10

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1029)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1030)> allowAbsoluteUrls: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1031)> data: undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1032)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1033)> request: <ref *1> ClientRequest {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1034)> _events: [Object: null prototype] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1035)> abort: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1036)> aborted: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1037)> connect: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1038)> error: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1039)> socket: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1040)> timeout: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1041)> finish: [Function: requestOnFinish]

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1042)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1043)> _eventsCount: 7,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1044)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1045)> outputData: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1046)> outputSize: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1047)> writable: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1048)> destroyed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1049)> _last: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1050)> chunkedEncoding: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1051)> shouldKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1052)> maxRequestsOnConnectionReached: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1053)> _defaultKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1054)> useChunkedEncodingByDefault: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1055)> sendDate: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1056)> _removedConnection: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1057)> _removedContLen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1058)> _removedTE: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1059)> strictContentLength: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1060)> _contentLength: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1061)> _hasBody: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1062)> _trailer: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1063)> finished: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1064)> _headerSent: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1065)> _closed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1066)> _header: 'GET /ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Delivery&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10 HTTP/1.1\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1067)> 'Accept: application/json, text/plain, */*\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1068)> 'User-Agent: axios/1.9.0\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1069)> 'Accept-Encoding: gzip, compress, deflate, br\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1070)> 'Host: 127.0.0.1:9199\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1071)> 'Connection: keep-alive\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1072)> '\r\n',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1073)> _keepAliveTimeout: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1074)> _onPendingData: [Function: nop],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1075)> agent: Agent {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1076)> _events: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1077)> _eventsCount: 2,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1078)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1079)> options: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1080)> defaultPort: 80,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1081)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1082)> requests: [Object: null prototype] {},

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1083)> sockets: [Object: null prototype] {},

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1084)> freeSockets: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1085)> keepAliveMsecs: 1000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1086)> keepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1087)> maxSockets: Infinity,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1088)> maxFreeSockets: 256,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1089)> scheduling: 'lifo',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1090)> maxTotalSockets: Infinity,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1091)> totalSocketCount: 4,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1092)> agentKeepAliveTimeoutBuffer: 1000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1093)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1094)> Symbol(kCapture): false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1095)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1096)> socketPath: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1097)> method: 'GET',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1098)> maxHeaderSize: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1099)> insecureHTTPParser: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1100)> httpValidation: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1101)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1102)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1103)> res: IncomingMessage {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1104)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1105)> _readableState: [ReadableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1106)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1107)> socket: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1108)> httpVersionMajor: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1109)> httpVersionMinor: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1110)> httpVersion: '1.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1111)> complete: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1112)> rawHeaders: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1113)> rawTrailers: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1114)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1115)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1116)> upgrade: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1117)> url: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1118)> method: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1119)> statusCode: 500,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1120)> statusMessage: 'Internal Server Error',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1121)> client: [Socket],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1122)> _consuming: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1123)> _dumped: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1124)> req: [Circular *1],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1125)> _eventsCount: 4,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1126)> responseUrl: '[http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Delivery&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10](http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Delivery&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1127)> redirects: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1128)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1129)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1130)> Symbol(kHeaders): [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1131)> Symbol(kHeadersCount): 10,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1132)> Symbol(kTrailers): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1133)> Symbol(kTrailersCount): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1134)> Symbol(kAbortController): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1135)> Symbol(kAbortSignalSocket): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1136)> Symbol(kAbortSignalListener): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1137)> Symbol(kAbortSignalDetached): true

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1138)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1139)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1140)> timeoutCb: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1141)> upgradeOrConnect: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1142)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1143)> maxHeadersCount: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1144)> reusedSocket: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1145)> host: '127.0.0.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1146)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1147)> _redirectable: Writable {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1148)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1149)> _writableState: [WritableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1150)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1151)> _options: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1152)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1153)> _ending: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1154)> _redirectCount: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1155)> _redirects: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1156)> _requestBodyLength: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1157)> _requestBodyBuffers: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1158)> _eventsCount: 3,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1159)> _onNativeResponse: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1160)> _currentRequest: [Circular *1],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1161)> _currentUrl: '[http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Delivery&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10](http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Delivery&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1162)> _timeout: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1163)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1164)> Symbol(kCapture): false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1165)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1166)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1167)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1168)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1169)> Symbol(kNeedDrain): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1170)> Symbol(corked): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1171)> Symbol(kChunkedBuffer): [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1172)> Symbol(kChunkedLength): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1173)> Symbol(kSocket): Socket {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1174)> connecting: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1175)> _hadError: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1176)> _parent: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1177)> _host: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1178)> _closeAfterHandlingError: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1179)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1180)> _readableState: [ReadableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1181)> _writableState: [WritableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1182)> allowHalfOpen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1183)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1184)> _eventsCount: 6,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1185)> _sockname: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1186)> _pendingData: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1187)> _pendingEncoding: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1188)> server: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1189)> _server: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1190)> timeout: 4000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1191)> _httpMessage: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1192)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1193)> Symbol(async_id_symbol): -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1194)> Symbol(kHandle): [TCP],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1195)> Symbol(lastWriteQueueSize): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1196)> Symbol(timeout): Timeout {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1197)> _idleTimeout: 4000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1198)> _idlePrev: [Timeout],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1199)> _idleNext: [Timeout],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1200)> _idleStart: 1338,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1201)> _onTimeout: [Function: onStreamTimeout],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1202)> _timerArgs: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1203)> _repeat: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1204)> _destroyed: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1205)> Symbol(refed): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1206)> Symbol(kHasPrimitive): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1207)> Symbol(asyncId): 1684,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1208)> Symbol(triggerId): 1682,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1209)> Symbol(kAsyncContextFrame): undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1210)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1211)> Symbol(kBuffer): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1212)> Symbol(kBufferCb): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1213)> Symbol(kBufferGen): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1214)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1215)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1216)> Symbol(kSetNoDelay): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1217)> Symbol(kSetKeepAlive): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1218)> Symbol(kSetKeepAliveInitialDelay): 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1219)> Symbol(kSetTOS): undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1220)> Symbol(kBytesRead): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1221)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1222)> Symbol(kSetKeepAliveInterval): undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1223)> Symbol(kSetKeepAliveCount): undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1224)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1225)> Symbol(kOutHeaders): [Object: null prototype] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1226)> accept: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1227)> 'user-agent': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1228)> 'accept-encoding': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1229)> host: [Array]

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1230)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1231)> Symbol(errored): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1232)> Symbol(kWritableFinished): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1233)> Symbol(kEndCallbacks): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1234)> Symbol(kFlushError): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1235)> Symbol(kHighWaterMark): 65536,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1236)> Symbol(kRejectNonStandardBodyWrites): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1237)> Symbol(kPath): '/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Delivery&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1238)> Symbol(kProxyRewrittenToAbsolute): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1239)> Symbol(kAuthority): '127.0.0.1:9199',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1240)> Symbol(kUniqueHeaders): null

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1241)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1242)> response: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1243)> status: 500,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1244)> statusText: 'Internal Server Error',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1245)> headers: Object [AxiosHeaders] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1246)> 'content-type': 'application/json',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1247)> date: 'Sun, 08 Nov 2026 12:13:24 GMT',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1248)> connection: 'keep-alive',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1249)> 'keep-alive': 'timeout=5',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1250)> 'transfer-encoding': 'chunked'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1251)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1252)> config: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1253)> transitional: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1254)> adapter: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1255)> transformRequest: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1256)> transformResponse: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1257)> timeout: 30000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1258)> xsrfCookieName: 'XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1259)> xsrfHeaderName: 'X-XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1260)> maxContentLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1261)> maxBodyLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1262)> env: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1263)> validateStatus: [Function: validateStatus],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1264)> headers: [Object [AxiosHeaders]],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1265)> method: 'get',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1266)> url: '[http://127.0.0.1:9199/ezamowienia](http://127.0.0.1:9199/ezamowienia)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1267)> params: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1268)> allowAbsoluteUrls: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1269)> data: undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1270)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1271)> request: <ref *1> ClientRequest {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1272)> _events: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1273)> _eventsCount: 7,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1274)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1275)> outputData: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1276)> outputSize: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1277)> writable: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1278)> destroyed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1279)> _last: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1280)> chunkedEncoding: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1281)> shouldKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1282)> maxRequestsOnConnectionReached: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1283)> _defaultKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1284)> useChunkedEncodingByDefault: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1285)> sendDate: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1286)> _removedConnection: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1287)> _removedContLen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1288)> _removedTE: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1289)> strictContentLength: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1290)> _contentLength: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1291)> _hasBody: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1292)> _trailer: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1293)> finished: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1294)> _headerSent: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1295)> _closed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1296)> _header: 'GET /ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Delivery&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10 HTTP/1.1\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1297)> 'Accept: application/json, text/plain, */*\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1298)> 'User-Agent: axios/1.9.0\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1299)> 'Accept-Encoding: gzip, compress, deflate, br\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1300)> 'Host: 127.0.0.1:9199\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1301)> 'Connection: keep-alive\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1302)> '\r\n',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1303)> _keepAliveTimeout: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1304)> _onPendingData: [Function: nop],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1305)> agent: [Agent],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1306)> socketPath: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1307)> method: 'GET',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1308)> maxHeaderSize: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1309)> insecureHTTPParser: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1310)> httpValidation: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1311)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1312)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1313)> res: [IncomingMessage],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1314)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1315)> timeoutCb: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1316)> upgradeOrConnect: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1317)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1318)> maxHeadersCount: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1319)> reusedSocket: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1320)> host: '127.0.0.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1321)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1322)> _redirectable: [Writable],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1323)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1324)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1325)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1326)> Symbol(kNeedDrain): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1327)> Symbol(corked): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1328)> Symbol(kChunkedBuffer): [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1329)> Symbol(kChunkedLength): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1330)> Symbol(kSocket): [Socket],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1331)> Symbol(kOutHeaders): [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1332)> Symbol(errored): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1333)> Symbol(kWritableFinished): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1334)> Symbol(kEndCallbacks): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1335)> Symbol(kFlushError): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1336)> Symbol(kHighWaterMark): 65536,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1337)> Symbol(kRejectNonStandardBodyWrites): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1338)> Symbol(kPath): '/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Delivery&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1339)> Symbol(kProxyRewrittenToAbsolute): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1340)> Symbol(kAuthority): '127.0.0.1:9199',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1341)> Symbol(kUniqueHeaders): null

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1342)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1343)> data: { error: 'boom' }

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1344)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1345)> status: 500

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1346)> }

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1347)> Błąd pobierania przetargów z eZamówień (Services): AxiosError: Request failed with status code 500

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1348)> at settle (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:2049:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1349)> at IncomingMessage.handleStreamEnd (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:3166:11)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1350)> at IncomingMessage.emit (node:events:526:24)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1351)> at endReadableNT (node:internal/streams/readable:1783:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1352)> at process.processTicksAndRejections (node:internal/process/task_queues:90:21)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1353)> at Axios.request (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:4276:41)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1354)> at process.processTicksAndRejections (node:internal/process/task_queues:104:5)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1355)> at async requestWithRetry (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/http.js:29:20)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1356)> at async fetchOrderType (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/ezamowienia.js:64:26)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1357)> at async Promise.allSettled (index 1)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1358)> at async Object.fetchEzamowienia [as E_ZAMOWIENIA] (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/ezamowienia.js:101:21)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1359)> at async Promise.all (index 1)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1360)> at async refreshDay (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/refresh.js:95:25)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1361)> at async /home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/firebase-functions/lib/common/providers/https.js:544:26

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1362)> at async runFunction (/home/runner/work/TED_Tenders/TED_Tenders/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js:506:9) {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1363)> code: 'ERR_BAD_RESPONSE',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1364)> config: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1365)> transitional: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1366)> silentJSONParsing: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1367)> forcedJSONParsing: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1368)> clarifyTimeoutError: false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1369)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1370)> adapter: [ 'xhr', 'http', 'fetch' ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1371)> transformRequest: [ [Function: transformRequest] ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1372)> transformResponse: [ [Function: transformResponse] ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1373)> timeout: 30000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1374)> xsrfCookieName: 'XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1375)> xsrfHeaderName: 'X-XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1376)> maxContentLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1377)> maxBodyLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1378)> env: { FormData: [Function [FormData]], Blob: [class Blob] },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1379)> validateStatus: [Function: validateStatus],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1380)> headers: Object [AxiosHeaders] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1381)> Accept: 'application/json, text/plain, */*',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1382)> 'Content-Type': undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1383)> 'User-Agent': 'axios/1.9.0',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1384)> 'Accept-Encoding': 'gzip, compress, deflate, br'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1385)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1386)> method: 'get',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1387)> url: '[http://127.0.0.1:9199/ezamowienia](http://127.0.0.1:9199/ezamowienia)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1388)> params: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1389)> noticeType: 'ContractNotice',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1390)> isTenderAmountBelowEU: 'true',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1391)> publicationDateFrom: '2026-11-07',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1392)> publicationDateTo: '2026-11-08',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1393)> orderType: 'Services',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1394)> SortingColumnName: 'PublicationDate',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1395)> SortingDirection: 'DESC',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1396)> PageNumber: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1397)> PageSize: 10

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1398)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1399)> allowAbsoluteUrls: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1400)> data: undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1401)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1402)> request: <ref *1> ClientRequest {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1403)> _events: [Object: null prototype] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1404)> abort: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1405)> aborted: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1406)> connect: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1407)> error: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1408)> socket: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1409)> timeout: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1410)> finish: [Function: requestOnFinish]

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1411)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1412)> _eventsCount: 7,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1413)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1414)> outputData: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1415)> outputSize: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1416)> writable: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1417)> destroyed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1418)> _last: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1419)> chunkedEncoding: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1420)> shouldKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1421)> maxRequestsOnConnectionReached: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1422)> _defaultKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1423)> useChunkedEncodingByDefault: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1424)> sendDate: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1425)> _removedConnection: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1426)> _removedContLen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1427)> _removedTE: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1428)> strictContentLength: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1429)> _contentLength: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1430)> _hasBody: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1431)> _trailer: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1432)> finished: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1433)> _headerSent: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1434)> _closed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1435)> _header: 'GET /ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Services&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10 HTTP/1.1\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1436)> 'Accept: application/json, text/plain, */*\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1437)> 'User-Agent: axios/1.9.0\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1438)> 'Accept-Encoding: gzip, compress, deflate, br\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1439)> 'Host: 127.0.0.1:9199\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1440)> 'Connection: keep-alive\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1441)> '\r\n',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1442)> _keepAliveTimeout: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1443)> _onPendingData: [Function: nop],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1444)> agent: Agent {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1445)> _events: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1446)> _eventsCount: 2,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1447)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1448)> options: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1449)> defaultPort: 80,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1450)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1451)> requests: [Object: null prototype] {},

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1452)> sockets: [Object: null prototype] {},

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1453)> freeSockets: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1454)> keepAliveMsecs: 1000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1455)> keepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1456)> maxSockets: Infinity,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1457)> maxFreeSockets: 256,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1458)> scheduling: 'lifo',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1459)> maxTotalSockets: Infinity,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1460)> totalSocketCount: 4,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1461)> agentKeepAliveTimeoutBuffer: 1000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1462)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1463)> Symbol(kCapture): false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1464)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1465)> socketPath: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1466)> method: 'GET',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1467)> maxHeaderSize: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1468)> insecureHTTPParser: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1469)> httpValidation: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1470)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1471)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1472)> res: IncomingMessage {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1473)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1474)> _readableState: [ReadableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1475)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1476)> socket: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1477)> httpVersionMajor: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1478)> httpVersionMinor: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1479)> httpVersion: '1.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1480)> complete: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1481)> rawHeaders: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1482)> rawTrailers: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1483)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1484)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1485)> upgrade: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1486)> url: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1487)> method: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1488)> statusCode: 500,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1489)> statusMessage: 'Internal Server Error',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1490)> client: [Socket],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1491)> _consuming: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1492)> _dumped: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1493)> req: [Circular *1],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1494)> _eventsCount: 4,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1495)> responseUrl: '[http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Services&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10](http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Services&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1496)> redirects: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1497)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1498)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1499)> Symbol(kHeaders): [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1500)> Symbol(kHeadersCount): 10,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1501)> Symbol(kTrailers): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1502)> Symbol(kTrailersCount): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1503)> Symbol(kAbortController): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1504)> Symbol(kAbortSignalSocket): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1505)> Symbol(kAbortSignalListener): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1506)> Symbol(kAbortSignalDetached): true

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1507)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1508)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1509)> timeoutCb: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1510)> upgradeOrConnect: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1511)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1512)> maxHeadersCount: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1513)> reusedSocket: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1514)> host: '127.0.0.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1515)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1516)> _redirectable: Writable {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1517)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1518)> _writableState: [WritableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1519)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1520)> _options: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1521)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1522)> _ending: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1523)> _redirectCount: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1524)> _redirects: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1525)> _requestBodyLength: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1526)> _requestBodyBuffers: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1527)> _eventsCount: 3,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1528)> _onNativeResponse: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1529)> _currentRequest: [Circular *1],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1530)> _currentUrl: '[http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Services&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10](http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Services&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1531)> _timeout: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1532)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1533)> Symbol(kCapture): false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1534)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1535)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1536)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1537)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1538)> Symbol(kNeedDrain): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1539)> Symbol(corked): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1540)> Symbol(kChunkedBuffer): [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1541)> Symbol(kChunkedLength): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1542)> Symbol(kSocket): Socket {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1543)> connecting: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1544)> _hadError: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1545)> _parent: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1546)> _host: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1547)> _closeAfterHandlingError: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1548)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1549)> _readableState: [ReadableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1550)> _writableState: [WritableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1551)> allowHalfOpen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1552)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1553)> _eventsCount: 6,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1554)> _sockname: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1555)> _pendingData: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1556)> _pendingEncoding: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1557)> server: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1558)> _server: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1559)> timeout: 4000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1560)> _httpMessage: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1561)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1562)> Symbol(async_id_symbol): -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1563)> Symbol(kHandle): [TCP],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1564)> Symbol(lastWriteQueueSize): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1565)> Symbol(timeout): Timeout {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1566)> _idleTimeout: 4000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1567)> _idlePrev: [Timeout],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1568)> _idleNext: [Timeout],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1569)> _idleStart: 1339,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1570)> _onTimeout: [Function: onStreamTimeout],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1571)> _timerArgs: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1572)> _repeat: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1573)> _destroyed: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1574)> Symbol(refed): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1575)> Symbol(kHasPrimitive): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1576)> Symbol(asyncId): 1692,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1577)> Symbol(triggerId): 1690,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1578)> Symbol(kAsyncContextFrame): undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1579)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1580)> Symbol(kBuffer): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1581)> Symbol(kBufferCb): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1582)> Symbol(kBufferGen): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1583)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1584)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1585)> Symbol(kSetNoDelay): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1586)> Symbol(kSetKeepAlive): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1587)> Symbol(kSetKeepAliveInitialDelay): 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1588)> Symbol(kSetTOS): undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1589)> Symbol(kBytesRead): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1590)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1591)> Symbol(kSetKeepAliveInterval): undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1592)> Symbol(kSetKeepAliveCount): undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1593)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1594)> Symbol(kOutHeaders): [Object: null prototype] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1595)> accept: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1596)> 'user-agent': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1597)> 'accept-encoding': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1598)> host: [Array]

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1599)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1600)> Symbol(errored): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1601)> Symbol(kWritableFinished): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1602)> Symbol(kEndCallbacks): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1603)> Symbol(kFlushError): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1604)> Symbol(kHighWaterMark): 65536,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1605)> Symbol(kRejectNonStandardBodyWrites): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1606)> Symbol(kPath): '/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Services&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1607)> Symbol(kProxyRewrittenToAbsolute): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1608)> Symbol(kAuthority): '127.0.0.1:9199',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1609)> Symbol(kUniqueHeaders): null

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1610)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1611)> response: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1612)> status: 500,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1613)> statusText: 'Internal Server Error',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1614)> headers: Object [AxiosHeaders] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1615)> 'content-type': 'application/json',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1616)> date: 'Sun, 08 Nov 2026 12:13:24 GMT',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1617)> connection: 'keep-alive',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1618)> 'keep-alive': 'timeout=5',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1619)> 'transfer-encoding': 'chunked'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1620)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1621)> config: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1622)> transitional: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1623)> adapter: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1624)> transformRequest: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1625)> transformResponse: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1626)> timeout: 30000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1627)> xsrfCookieName: 'XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1628)> xsrfHeaderName: 'X-XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1629)> maxContentLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1630)> maxBodyLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1631)> env: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1632)> validateStatus: [Function: validateStatus],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1633)> headers: [Object [AxiosHeaders]],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1634)> method: 'get',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1635)> url: '[http://127.0.0.1:9199/ezamowienia](http://127.0.0.1:9199/ezamowienia)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1636)> params: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1637)> allowAbsoluteUrls: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1638)> data: undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1639)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1640)> request: <ref *1> ClientRequest {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1641)> _events: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1642)> _eventsCount: 7,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1643)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1644)> outputData: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1645)> outputSize: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1646)> writable: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1647)> destroyed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1648)> _last: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1649)> chunkedEncoding: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1650)> shouldKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1651)> maxRequestsOnConnectionReached: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1652)> _defaultKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1653)> useChunkedEncodingByDefault: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1654)> sendDate: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1655)> _removedConnection: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1656)> _removedContLen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1657)> _removedTE: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1658)> strictContentLength: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1659)> _contentLength: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1660)> _hasBody: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1661)> _trailer: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1662)> finished: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1663)> _headerSent: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1664)> _closed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1665)> _header: 'GET /ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Services&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10 HTTP/1.1\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1666)> 'Accept: application/json, text/plain, */*\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1667)> 'User-Agent: axios/1.9.0\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1668)> 'Accept-Encoding: gzip, compress, deflate, br\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1669)> 'Host: 127.0.0.1:9199\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1670)> 'Connection: keep-alive\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1671)> '\r\n',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1672)> _keepAliveTimeout: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1673)> _onPendingData: [Function: nop],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1674)> agent: [Agent],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1675)> socketPath: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1676)> method: 'GET',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1677)> maxHeaderSize: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1678)> insecureHTTPParser: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1679)> httpValidation: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1680)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1681)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1682)> res: [IncomingMessage],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1683)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1684)> timeoutCb: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1685)> upgradeOrConnect: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1686)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1687)> maxHeadersCount: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1688)> reusedSocket: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1689)> host: '127.0.0.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1690)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1691)> _redirectable: [Writable],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1692)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1693)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1694)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1695)> Symbol(kNeedDrain): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1696)> Symbol(corked): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1697)> Symbol(kChunkedBuffer): [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1698)> Symbol(kChunkedLength): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1699)> Symbol(kSocket): [Socket],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1700)> Symbol(kOutHeaders): [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1701)> Symbol(errored): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1702)> Symbol(kWritableFinished): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1703)> Symbol(kEndCallbacks): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1704)> Symbol(kFlushError): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1705)> Symbol(kHighWaterMark): 65536,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1706)> Symbol(kRejectNonStandardBodyWrites): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1707)> Symbol(kPath): '/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Services&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1708)> Symbol(kProxyRewrittenToAbsolute): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1709)> Symbol(kAuthority): '127.0.0.1:9199',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1710)> Symbol(kUniqueHeaders): null

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1711)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1712)> data: { error: 'boom' }

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1713)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1714)> status: 500

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1715)> }

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1716)> Błąd pobierania przetargów z eZamówień (Works): AxiosError: Request failed with status code 500

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1717)> at settle (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:2049:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1718)> at IncomingMessage.handleStreamEnd (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:3166:11)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1719)> at IncomingMessage.emit (node:events:526:24)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1720)> at endReadableNT (node:internal/streams/readable:1783:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1721)> at process.processTicksAndRejections (node:internal/process/task_queues:90:21)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1722)> at Axios.request (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:4276:41)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1723)> at process.processTicksAndRejections (node:internal/process/task_queues:104:5)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1724)> at async requestWithRetry (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/http.js:29:20)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1725)> at async fetchOrderType (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/ezamowienia.js:64:26)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1726)> at async Promise.allSettled (index 2)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1727)> at async Object.fetchEzamowienia [as E_ZAMOWIENIA] (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/ezamowienia.js:101:21)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1728)> at async Promise.all (index 1)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1729)> at async refreshDay (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/refresh.js:95:25)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1730)> at async /home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/firebase-functions/lib/common/providers/https.js:544:26

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1731)> at async runFunction (/home/runner/work/TED_Tenders/TED_Tenders/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js:506:9) {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1732)> code: 'ERR_BAD_RESPONSE',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1733)> config: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1734)> transitional: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1735)> silentJSONParsing: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1736)> forcedJSONParsing: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1737)> clarifyTimeoutError: false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1738)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1739)> adapter: [ 'xhr', 'http', 'fetch' ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1740)> transformRequest: [ [Function: transformRequest] ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1741)> transformResponse: [ [Function: transformResponse] ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1742)> timeout: 30000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1743)> xsrfCookieName: 'XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1744)> xsrfHeaderName: 'X-XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1745)> maxContentLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1746)> maxBodyLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1747)> env: { FormData: [Function [FormData]], Blob: [class Blob] },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1748)> validateStatus: [Function: validateStatus],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1749)> headers: Object [AxiosHeaders] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1750)> Accept: 'application/json, text/plain, */*',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1751)> 'Content-Type': undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1752)> 'User-Agent': 'axios/1.9.0',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1753)> 'Accept-Encoding': 'gzip, compress, deflate, br'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1754)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1755)> method: 'get',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1756)> url: '[http://127.0.0.1:9199/ezamowienia](http://127.0.0.1:9199/ezamowienia)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1757)> params: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1758)> noticeType: 'ContractNotice',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1759)> isTenderAmountBelowEU: 'true',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1760)> publicationDateFrom: '2026-11-07',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1761)> publicationDateTo: '2026-11-08',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1762)> orderType: 'Works',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1763)> SortingColumnName: 'PublicationDate',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1764)> SortingDirection: 'DESC',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1765)> PageNumber: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1766)> PageSize: 10

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1767)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1768)> allowAbsoluteUrls: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1769)> data: undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1770)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1771)> request: <ref *1> ClientRequest {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1772)> _events: [Object: null prototype] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1773)> abort: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1774)> aborted: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1775)> connect: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1776)> error: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1777)> socket: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1778)> timeout: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1779)> finish: [Function: requestOnFinish]

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1780)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1781)> _eventsCount: 7,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1782)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1783)> outputData: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1784)> outputSize: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1785)> writable: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1786)> destroyed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1787)> _last: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1788)> chunkedEncoding: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1789)> shouldKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1790)> maxRequestsOnConnectionReached: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1791)> _defaultKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1792)> useChunkedEncodingByDefault: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1793)> sendDate: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1794)> _removedConnection: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1795)> _removedContLen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1796)> _removedTE: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1797)> strictContentLength: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1798)> _contentLength: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1799)> _hasBody: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1800)> _trailer: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1801)> finished: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1802)> _headerSent: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1803)> _closed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1804)> _header: 'GET /ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Works&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10 HTTP/1.1\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1805)> 'Accept: application/json, text/plain, */*\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1806)> 'User-Agent: axios/1.9.0\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1807)> 'Accept-Encoding: gzip, compress, deflate, br\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1808)> 'Host: 127.0.0.1:9199\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1809)> 'Connection: keep-alive\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1810)> '\r\n',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1811)> _keepAliveTimeout: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1812)> _onPendingData: [Function: nop],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1813)> agent: Agent {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1814)> _events: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1815)> _eventsCount: 2,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1816)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1817)> options: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1818)> defaultPort: 80,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1819)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1820)> requests: [Object: null prototype] {},

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1821)> sockets: [Object: null prototype] {},

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1822)> freeSockets: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1823)> keepAliveMsecs: 1000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1824)> keepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1825)> maxSockets: Infinity,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1826)> maxFreeSockets: 256,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1827)> scheduling: 'lifo',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1828)> maxTotalSockets: Infinity,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1829)> totalSocketCount: 4,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1830)> agentKeepAliveTimeoutBuffer: 1000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1831)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1832)> Symbol(kCapture): false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1833)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1834)> socketPath: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1835)> method: 'GET',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1836)> maxHeaderSize: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1837)> insecureHTTPParser: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1838)> httpValidation: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1839)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1840)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1841)> res: IncomingMessage {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1842)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1843)> _readableState: [ReadableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1844)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1845)> socket: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1846)> httpVersionMajor: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1847)> httpVersionMinor: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1848)> httpVersion: '1.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1849)> complete: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1850)> rawHeaders: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1851)> rawTrailers: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1852)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1853)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1854)> upgrade: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1855)> url: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1856)> method: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1857)> statusCode: 500,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1858)> statusMessage: 'Internal Server Error',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1859)> client: [Socket],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1860)> _consuming: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1861)> _dumped: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1862)> req: [Circular *1],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1863)> _eventsCount: 4,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1864)> responseUrl: '[http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Works&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10](http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Works&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1865)> redirects: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1866)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1867)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1868)> Symbol(kHeaders): [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1869)> Symbol(kHeadersCount): 10,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1870)> Symbol(kTrailers): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1871)> Symbol(kTrailersCount): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1872)> Symbol(kAbortController): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1873)> Symbol(kAbortSignalSocket): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1874)> Symbol(kAbortSignalListener): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1875)> Symbol(kAbortSignalDetached): true

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1876)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1877)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1878)> timeoutCb: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1879)> upgradeOrConnect: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1880)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1881)> maxHeadersCount: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1882)> reusedSocket: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1883)> host: '127.0.0.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1884)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1885)> _redirectable: Writable {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1886)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1887)> _writableState: [WritableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1888)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1889)> _options: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1890)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1891)> _ending: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1892)> _redirectCount: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1893)> _redirects: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1894)> _requestBodyLength: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1895)> _requestBodyBuffers: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1896)> _eventsCount: 3,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1897)> _onNativeResponse: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1898)> _currentRequest: [Circular *1],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1899)> _currentUrl: '[http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Works&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10](http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Works&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1900)> _timeout: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1901)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1902)> Symbol(kCapture): false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1903)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1904)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1905)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1906)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1907)> Symbol(kNeedDrain): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1908)> Symbol(corked): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1909)> Symbol(kChunkedBuffer): [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1910)> Symbol(kChunkedLength): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1911)> Symbol(kSocket): Socket {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1912)> connecting: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1913)> _hadError: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1914)> _parent: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1915)> _host: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1916)> _closeAfterHandlingError: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1917)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1918)> _readableState: [ReadableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1919)> _writableState: [WritableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1920)> allowHalfOpen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1921)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1922)> _eventsCount: 6,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1923)> _sockname: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1924)> _pendingData: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1925)> _pendingEncoding: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1926)> server: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1927)> _server: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1928)> timeout: 4000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1929)> _httpMessage: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1930)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1931)> Symbol(async_id_symbol): -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1932)> Symbol(kHandle): [TCP],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1933)> Symbol(lastWriteQueueSize): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1934)> Symbol(timeout): Timeout {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1935)> _idleTimeout: 4000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1936)> _idlePrev: [TimersList],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1937)> _idleNext: [Timeout],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1938)> _idleStart: 1339,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1939)> _onTimeout: [Function: onStreamTimeout],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1940)> _timerArgs: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1941)> _repeat: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1942)> _destroyed: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1943)> Symbol(refed): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1944)> Symbol(kHasPrimitive): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1945)> Symbol(asyncId): 1700,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1946)> Symbol(triggerId): 1698,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1947)> Symbol(kAsyncContextFrame): undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1948)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1949)> Symbol(kBuffer): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1950)> Symbol(kBufferCb): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1951)> Symbol(kBufferGen): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1952)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1953)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1954)> Symbol(kSetNoDelay): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1955)> Symbol(kSetKeepAlive): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1956)> Symbol(kSetKeepAliveInitialDelay): 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1957)> Symbol(kSetTOS): undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1958)> Symbol(kBytesRead): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1959)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1960)> Symbol(kSetKeepAliveInterval): undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1961)> Symbol(kSetKeepAliveCount): undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1962)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1963)> Symbol(kOutHeaders): [Object: null prototype] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1964)> accept: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1965)> 'user-agent': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1966)> 'accept-encoding': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1967)> host: [Array]

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1968)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1969)> Symbol(errored): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1970)> Symbol(kWritableFinished): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1971)> Symbol(kEndCallbacks): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1972)> Symbol(kFlushError): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1973)> Symbol(kHighWaterMark): 65536,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1974)> Symbol(kRejectNonStandardBodyWrites): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1975)> Symbol(kPath): '/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Works&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1976)> Symbol(kProxyRewrittenToAbsolute): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1977)> Symbol(kAuthority): '127.0.0.1:9199',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1978)> Symbol(kUniqueHeaders): null

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1979)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1980)> response: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1981)> status: 500,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1982)> statusText: 'Internal Server Error',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1983)> headers: Object [AxiosHeaders] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1984)> 'content-type': 'application/json',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1985)> date: 'Sun, 08 Nov 2026 12:13:24 GMT',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1986)> connection: 'keep-alive',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1987)> 'keep-alive': 'timeout=5',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1988)> 'transfer-encoding': 'chunked'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1989)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1990)> config: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1991)> transitional: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1992)> adapter: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1993)> transformRequest: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1994)> transformResponse: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1995)> timeout: 30000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1996)> xsrfCookieName: 'XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1997)> xsrfHeaderName: 'X-XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1998)> maxContentLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:1999)> maxBodyLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2000)> env: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2001)> validateStatus: [Function: validateStatus],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2002)> headers: [Object [AxiosHeaders]],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2003)> method: 'get',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2004)> url: '[http://127.0.0.1:9199/ezamowienia](http://127.0.0.1:9199/ezamowienia)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2005)> params: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2006)> allowAbsoluteUrls: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2007)> data: undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2008)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2009)> request: <ref *1> ClientRequest {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2010)> _events: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2011)> _eventsCount: 7,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2012)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2013)> outputData: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2014)> outputSize: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2015)> writable: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2016)> destroyed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2017)> _last: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2018)> chunkedEncoding: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2019)> shouldKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2020)> maxRequestsOnConnectionReached: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2021)> _defaultKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2022)> useChunkedEncodingByDefault: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2023)> sendDate: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2024)> _removedConnection: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2025)> _removedContLen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2026)> _removedTE: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2027)> strictContentLength: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2028)> _contentLength: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2029)> _hasBody: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2030)> _trailer: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2031)> finished: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2032)> _headerSent: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2033)> _closed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2034)> _header: 'GET /ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Works&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10 HTTP/1.1\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2035)> 'Accept: application/json, text/plain, */*\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2036)> 'User-Agent: axios/1.9.0\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2037)> 'Accept-Encoding: gzip, compress, deflate, br\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2038)> 'Host: 127.0.0.1:9199\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2039)> 'Connection: keep-alive\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2040)> '\r\n',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2041)> _keepAliveTimeout: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2042)> _onPendingData: [Function: nop],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2043)> agent: [Agent],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2044)> socketPath: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2045)> method: 'GET',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2046)> maxHeaderSize: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2047)> insecureHTTPParser: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2048)> httpValidation: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2049)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2050)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2051)> res: [IncomingMessage],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2052)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2053)> timeoutCb: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2054)> upgradeOrConnect: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2055)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2056)> maxHeadersCount: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2057)> reusedSocket: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2058)> host: '127.0.0.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2059)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2060)> _redirectable: [Writable],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2061)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2062)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2063)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2064)> Symbol(kNeedDrain): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2065)> Symbol(corked): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2066)> Symbol(kChunkedBuffer): [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2067)> Symbol(kChunkedLength): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2068)> Symbol(kSocket): [Socket],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2069)> Symbol(kOutHeaders): [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2070)> Symbol(errored): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2071)> Symbol(kWritableFinished): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2072)> Symbol(kEndCallbacks): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2073)> Symbol(kFlushError): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2074)> Symbol(kHighWaterMark): 65536,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2075)> Symbol(kRejectNonStandardBodyWrites): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2076)> Symbol(kPath): '/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-07&publicationDateTo=2026-11-08&orderType=Works&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2077)> Symbol(kProxyRewrittenToAbsolute): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2078)> Symbol(kAuthority): '127.0.0.1:9199',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2079)> Symbol(kUniqueHeaders): null

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2080)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2081)> data: { error: 'boom' }

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2082)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2083)> status: 500

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2084)> }

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2085)i functions: Finished "europe-central2-refreshTenders" in 57.3426ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2086)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2087)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2088)i functions: Finished "europe-central2-refreshTenders" in 77.435605ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2089)✔ zgłasza awarię, gdy żadne źródło nie odpowiada, i zwalnia blokadę (151.074706ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2090)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2091)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2092)> Źródło odpowiedziało 429, ponawiam za 10 ms (próba 1/3)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2093)> Źródło odpowiedziało 429, ponawiam za 30 ms (próba 2/3)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2094)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2095)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 5.860421ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2096)i functions: Finished "europe-central2-refreshTenders" in 81.310949ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2097)✔ ponawia zapytanie, gdy TED ogranicza tempo (429), i kończy sukcesem (84.222482ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2098)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2099)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2100)> Źródło odpowiedziało 429, ponawiam za 10 ms (próba 1/3)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2101)> Źródło odpowiedziało 429, ponawiam za 30 ms (próba 2/3)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2102)i functions: Beginning execution of "europe-central2-checkDocumentsTask"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2103)> Źródło odpowiedziało 429, ponawiam za 80 ms (próba 3/3)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2104)i functions: Finished "europe-central2-checkDocumentsTask" in 12.634107ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2105)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2106)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 1.611696ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2107)> Błąd pobierania przetargów z TED: AxiosError: Request failed with status code 429

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2108)> at settle (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:2049:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2109)> at IncomingMessage.handleStreamEnd (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:3166:11)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2110)> at IncomingMessage.emit (node:events:526:24)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2111)> at endReadableNT (node:internal/streams/readable:1783:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2112)> at process.processTicksAndRejections (node:internal/process/task_queues:90:21)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2113)> at Axios.request (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:4276:41)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2114)> at process.processTicksAndRejections (node:internal/process/task_queues:104:5)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2115)> at async requestWithRetry (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/http.js:29:20)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2116)> at async Object.fetchTed [as TED] (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/ted.js:123:30)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2117)> at async Promise.all (index 0)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2118)> at async refreshDay (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/refresh.js:95:25)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2119)> at async /home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/firebase-functions/lib/common/providers/https.js:544:26

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2120)> at async runFunction (/home/runner/work/TED_Tenders/TED_Tenders/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js:506:9)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2121)> at async runHTTPS (/home/runner/work/TED_Tenders/TED_Tenders/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js:531:5)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2122)> at async /home/runner/work/TED_Tenders/TED_Tenders/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js:694:21 {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2123)> code: 'ERR_BAD_REQUEST',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2124)> config: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2125)> transitional: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2126)> silentJSONParsing: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2127)> forcedJSONParsing: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2128)> clarifyTimeoutError: false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2129)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2130)> adapter: [ 'xhr', 'http', 'fetch' ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2131)> transformRequest: [ [Function: transformRequest] ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2132)> transformResponse: [ [Function: transformResponse] ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2133)> timeout: 30000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2134)> xsrfCookieName: 'XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2135)> xsrfHeaderName: 'X-XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2136)> maxContentLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2137)> maxBodyLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2138)> env: { FormData: [Function [FormData]], Blob: [class Blob] },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2139)> validateStatus: [Function: validateStatus],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2140)> headers: Object [AxiosHeaders] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2141)> Accept: 'application/json, text/plain, */*',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2142)> 'Content-Type': 'application/json',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2143)> 'User-Agent': 'axios/1.9.0',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2144)> 'Content-Length': '422',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2145)> 'Accept-Encoding': 'gzip, compress, deflate, br'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2146)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2147)> method: 'post',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2148)> url: '[http://127.0.0.1:9199/ted](http://127.0.0.1:9199/ted)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2149)> data: '{"query":"buyer-country=POL AND publication-date=20261108 AND classification-cpv=teeq AND notice-type=cn-standard","fields":["notice-title","classification-cpv","publication-date","publication-number","buyer-city","organisation-name-buyer","authority-main-activity","contract-nature","change-notice-version-identifier","deadline-receipt-tender-date-lot","document-url-lot","internal-identifier-proc"],"page":1,"limit":250}',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2150)> allowAbsoluteUrls: true

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2151)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2152)> request: <ref *1> ClientRequest {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2153)> _events: [Object: null prototype] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2154)> abort: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2155)> aborted: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2156)> connect: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2157)> error: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2158)> socket: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2159)> timeout: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2160)> finish: [Function: requestOnFinish]

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2161)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2162)> _eventsCount: 7,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2163)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2164)> outputData: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2165)> outputSize: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2166)> writable: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2167)> destroyed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2168)> _last: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2169)> chunkedEncoding: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2170)> shouldKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2171)> maxRequestsOnConnectionReached: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2172)> _defaultKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2173)> useChunkedEncodingByDefault: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2174)> sendDate: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2175)> _removedConnection: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2176)> _removedContLen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2177)> _removedTE: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2178)> strictContentLength: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2179)> _contentLength: 422,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2180)> _hasBody: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2181)> _trailer: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2182)> finished: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2183)> _headerSent: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2184)> _closed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2185)> _header: 'POST /ted HTTP/1.1\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2186)> 'Accept: application/json, text/plain, */*\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2187)> 'Content-Type: application/json\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2188)> 'User-Agent: axios/1.9.0\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2189)> 'Content-Length: 422\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2190)> 'Accept-Encoding: gzip, compress, deflate, br\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2191)> 'Host: 127.0.0.1:9199\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2192)> 'Connection: keep-alive\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2193)> '\r\n',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2194)> _keepAliveTimeout: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2195)> _onPendingData: [Function: nop],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2196)> agent: Agent {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2197)> _events: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2198)> _eventsCount: 2,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2199)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2200)> options: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2201)> defaultPort: 80,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2202)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2203)> requests: [Object: null prototype] {},

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2204)> sockets: [Object: null prototype] {},

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2205)> freeSockets: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2206)> keepAliveMsecs: 1000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2207)> keepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2208)> maxSockets: Infinity,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2209)> maxFreeSockets: 256,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2210)> scheduling: 'lifo',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2211)> maxTotalSockets: Infinity,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2212)> totalSocketCount: 4,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2213)> agentKeepAliveTimeoutBuffer: 1000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2214)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2215)> Symbol(kCapture): false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2216)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2217)> socketPath: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2218)> method: 'POST',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2219)> maxHeaderSize: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2220)> insecureHTTPParser: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2221)> httpValidation: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2222)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2223)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2224)> res: IncomingMessage {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2225)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2226)> _readableState: [ReadableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2227)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2228)> socket: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2229)> httpVersionMajor: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2230)> httpVersionMinor: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2231)> httpVersion: '1.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2232)> complete: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2233)> rawHeaders: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2234)> rawTrailers: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2235)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2236)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2237)> upgrade: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2238)> url: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2239)> method: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2240)> statusCode: 429,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2241)> statusMessage: 'Too Many Requests',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2242)> client: [Socket],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2243)> _consuming: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2244)> _dumped: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2245)> req: [Circular *1],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2246)> _eventsCount: 4,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2247)> responseUrl: '[http://127.0.0.1:9199/ted](http://127.0.0.1:9199/ted)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2248)> redirects: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2249)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2250)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2251)> Symbol(kHeaders): [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2252)> Symbol(kHeadersCount): 10,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2253)> Symbol(kTrailers): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2254)> Symbol(kTrailersCount): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2255)> Symbol(kAbortController): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2256)> Symbol(kAbortSignalSocket): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2257)> Symbol(kAbortSignalListener): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2258)> Symbol(kAbortSignalDetached): true

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2259)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2260)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2261)> timeoutCb: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2262)> upgradeOrConnect: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2263)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2264)> maxHeadersCount: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2265)> reusedSocket: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2266)> host: '127.0.0.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2267)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2268)> _redirectable: Writable {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2269)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2270)> _writableState: [WritableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2271)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2272)> _options: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2273)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2274)> _ending: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2275)> _redirectCount: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2276)> _redirects: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2277)> _requestBodyLength: 422,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2278)> _requestBodyBuffers: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2279)> _eventsCount: 3,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2280)> _onNativeResponse: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2281)> _currentRequest: [Circular *1],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2282)> _currentUrl: '[http://127.0.0.1:9199/ted](http://127.0.0.1:9199/ted)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2283)> _timeout: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2284)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2285)> Symbol(kCapture): false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2286)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2287)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2288)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2289)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2290)> Symbol(kNeedDrain): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2291)> Symbol(corked): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2292)> Symbol(kChunkedBuffer): [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2293)> Symbol(kChunkedLength): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2294)> Symbol(kSocket): Socket {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2295)> connecting: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2296)> _hadError: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2297)> _parent: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2298)> _host: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2299)> _closeAfterHandlingError: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2300)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2301)> _readableState: [ReadableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2302)> _writableState: [WritableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2303)> allowHalfOpen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2304)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2305)> _eventsCount: 6,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2306)> _sockname: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2307)> _pendingData: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2308)> _pendingEncoding: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2309)> server: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2310)> _server: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2311)> timeout: 4000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2312)> _httpMessage: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2313)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2314)> Symbol(async_id_symbol): -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2315)> Symbol(kHandle): [TCP],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2316)> Symbol(lastWriteQueueSize): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2317)> Symbol(timeout): Timeout {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2318)> _idleTimeout: 4000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2319)> _idlePrev: [TimersList],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2320)> _idleNext: [Timeout],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2321)> _idleStart: 1696,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2322)> _onTimeout: [Function: onStreamTimeout],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2323)> _timerArgs: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2324)> _repeat: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2325)> _destroyed: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2326)> Symbol(refed): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2327)> Symbol(kHasPrimitive): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2328)> Symbol(asyncId): 2939,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2329)> Symbol(triggerId): 2937,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2330)> Symbol(kAsyncContextFrame): undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2331)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2332)> Symbol(kBuffer): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2333)> Symbol(kBufferCb): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2334)> Symbol(kBufferGen): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2335)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2336)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2337)> Symbol(kSetNoDelay): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2338)> Symbol(kSetKeepAlive): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2339)> Symbol(kSetKeepAliveInitialDelay): 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2340)> Symbol(kSetTOS): undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2341)> Symbol(kBytesRead): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2342)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2343)> Symbol(kSetKeepAliveInterval): undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2344)> Symbol(kSetKeepAliveCount): undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2345)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2346)> Symbol(kOutHeaders): [Object: null prototype] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2347)> accept: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2348)> 'content-type': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2349)> 'user-agent': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2350)> 'content-length': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2351)> 'accept-encoding': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2352)> host: [Array]

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2353)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2354)> Symbol(errored): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2355)> Symbol(kWritableFinished): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2356)> Symbol(kEndCallbacks): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2357)> Symbol(kFlushError): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2358)> Symbol(kHighWaterMark): 65536,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2359)> Symbol(kRejectNonStandardBodyWrites): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2360)> Symbol(kPath): '/ted',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2361)> Symbol(kProxyRewrittenToAbsolute): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2362)> Symbol(kAuthority): '127.0.0.1:9199',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2363)> Symbol(kUniqueHeaders): null

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2364)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2365)> response: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2366)> status: 429,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2367)> statusText: 'Too Many Requests',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2368)> headers: Object [AxiosHeaders] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2369)> 'content-type': 'application/json',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2370)> date: 'Sun, 08 Nov 2026 12:13:24 GMT',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2371)> connection: 'keep-alive',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2372)> 'keep-alive': 'timeout=5',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2373)> 'transfer-encoding': 'chunked'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2374)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2375)> config: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2376)> transitional: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2377)> adapter: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2378)> transformRequest: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2379)> transformResponse: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2380)> timeout: 30000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2381)> xsrfCookieName: 'XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2382)> xsrfHeaderName: 'X-XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2383)> maxContentLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2384)> maxBodyLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2385)> env: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2386)> validateStatus: [Function: validateStatus],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2387)> headers: [Object [AxiosHeaders]],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2388)> method: 'post',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2389)> url: '[http://127.0.0.1:9199/ted](http://127.0.0.1:9199/ted)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2390)> data: '{"query":"buyer-country=POL AND publication-date=20261108 AND classification-cpv=teeq AND notice-type=cn-standard","fields":["notice-title","classification-cpv","publication-date","publication-number","buyer-city","organisation-name-buyer","authority-main-activity","contract-nature","change-notice-version-identifier","deadline-receipt-tender-date-lot","document-url-lot","internal-identifier-proc"],"page":1,"limit":250}',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2391)> allowAbsoluteUrls: true

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2392)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2393)> request: <ref *1> ClientRequest {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2394)> _events: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2395)> _eventsCount: 7,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2396)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2397)> outputData: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2398)> outputSize: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2399)> writable: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2400)> destroyed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2401)> _last: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2402)> chunkedEncoding: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2403)> shouldKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2404)> maxRequestsOnConnectionReached: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2405)> _defaultKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2406)> useChunkedEncodingByDefault: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2407)> sendDate: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2408)> _removedConnection: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2409)> _removedContLen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2410)> _removedTE: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2411)> strictContentLength: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2412)> _contentLength: 422,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2413)> _hasBody: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2414)> _trailer: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2415)> finished: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2416)> _headerSent: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2417)> _closed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2418)> _header: 'POST /ted HTTP/1.1\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2419)> 'Accept: application/json, text/plain, */*\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2420)> 'Content-Type: application/json\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2421)> 'User-Agent: axios/1.9.0\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2422)> 'Content-Length: 422\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2423)> 'Accept-Encoding: gzip, compress, deflate, br\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2424)> 'Host: 127.0.0.1:9199\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2425)> 'Connection: keep-alive\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2426)> '\r\n',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2427)> _keepAliveTimeout: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2428)> _onPendingData: [Function: nop],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2429)> agent: [Agent],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2430)> socketPath: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2431)> method: 'POST',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2432)> maxHeaderSize: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2433)> insecureHTTPParser: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2434)> httpValidation: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2435)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2436)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2437)> res: [IncomingMessage],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2438)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2439)> timeoutCb: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2440)> upgradeOrConnect: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2441)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2442)> maxHeadersCount: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2443)> reusedSocket: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2444)> host: '127.0.0.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2445)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2446)> _redirectable: [Writable],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2447)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2448)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2449)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2450)> Symbol(kNeedDrain): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2451)> Symbol(corked): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2452)> Symbol(kChunkedBuffer): [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2453)> Symbol(kChunkedLength): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2454)> Symbol(kSocket): [Socket],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2455)> Symbol(kOutHeaders): [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2456)> Symbol(errored): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2457)> Symbol(kWritableFinished): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2458)> Symbol(kEndCallbacks): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2459)> Symbol(kFlushError): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2460)> Symbol(kHighWaterMark): 65536,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2461)> Symbol(kRejectNonStandardBodyWrites): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2462)> Symbol(kPath): '/ted',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2463)> Symbol(kProxyRewrittenToAbsolute): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2464)> Symbol(kAuthority): '127.0.0.1:9199',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2465)> Symbol(kUniqueHeaders): null

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2466)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2467)> data: { error: 'Too Many Requests' }

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2468)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2469)> status: 429

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2470)> }

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2471)i functions: Finished "europe-central2-refreshTenders" in 165.599278ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2472)✔ zgłasza błąd źródła, gdy 429 trwa mimo ponawiania (168.086913ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2473)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2474)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2475)i functions: Finished "europe-central2-refreshTenders" in 7.835244ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2476)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2477)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2478)i functions: Finished "europe-central2-refreshTenders" in 23.233051ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2479)✔ nie pozwala na równoległe odświeżanie (43.777235ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2480)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2481)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2482)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2483)i functions: Finished "europe-central2-refreshTenders" in 23.665042ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2484)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 4.616078ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2485)✔ pozwala odświeżyć wskazany dzień z przeszłości i oznacza go jako kompletny w dzienniku (30.514301ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2486)✔ dzisiejszy dzień jest w dzienniku jako niekompletny (4.218721ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2487)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2488)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2489)> Błąd pobierania przetargów z TED: AxiosError: Request failed with status code 500

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2490)> at settle (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:2049:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2491)> at IncomingMessage.handleStreamEnd (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:3166:11)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2492)> at IncomingMessage.emit (node:events:526:24)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2493)> at endReadableNT (node:internal/streams/readable:1783:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2494)> at process.processTicksAndRejections (node:internal/process/task_queues:90:21)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2495)> at Axios.request (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:4276:41)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2496)> at process.processTicksAndRejections (node:internal/process/task_queues:104:5)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2497)> at async requestWithRetry (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/http.js:29:20)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2498)> at async Object.fetchTed [as TED] (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/ted.js:123:30)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2499)> at async Promise.all (index 0)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2500)> at async refreshDay (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/refresh.js:95:25)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2501)> at async /home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/firebase-functions/lib/common/providers/https.js:544:26

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2502)> at async runFunction (/home/runner/work/TED_Tenders/TED_Tenders/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js:506:9)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2503)> at async runHTTPS (/home/runner/work/TED_Tenders/TED_Tenders/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js:531:5)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2504)> at async /home/runner/work/TED_Tenders/TED_Tenders/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js:694:21 {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2505)> code: 'ERR_BAD_RESPONSE',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2506)> config: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2507)> transitional: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2508)> silentJSONParsing: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2509)> forcedJSONParsing: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2510)> clarifyTimeoutError: false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2511)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2512)> adapter: [ 'xhr', 'http', 'fetch' ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2513)> transformRequest: [ [Function: transformRequest] ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2514)> transformResponse: [ [Function: transformResponse] ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2515)> timeout: 30000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2516)> xsrfCookieName: 'XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2517)> xsrfHeaderName: 'X-XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2518)> maxContentLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2519)> maxBodyLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2520)> env: { FormData: [Function [FormData]], Blob: [class Blob] },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2521)> validateStatus: [Function: validateStatus],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2522)> headers: Object [AxiosHeaders] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2523)> Accept: 'application/json, text/plain, */*',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2524)> 'Content-Type': 'application/json',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2525)> 'User-Agent': 'axios/1.9.0',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2526)> 'Content-Length': '422',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2527)> 'Accept-Encoding': 'gzip, compress, deflate, br'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2528)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2529)> method: 'post',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2530)> url: '[http://127.0.0.1:9199/ted](http://127.0.0.1:9199/ted)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2531)> data: '{"query":"buyer-country=POL AND publication-date=20261106 AND classification-cpv=teeq AND notice-type=cn-standard","fields":["notice-title","classification-cpv","publication-date","publication-number","buyer-city","organisation-name-buyer","authority-main-activity","contract-nature","change-notice-version-identifier","deadline-receipt-tender-date-lot","document-url-lot","internal-identifier-proc"],"page":1,"limit":250}',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2532)> allowAbsoluteUrls: true

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2533)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2534)> request: <ref *1> ClientRequest {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2535)> _events: [Object: null prototype] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2536)> abort: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2537)> aborted: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2538)> connect: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2539)> error: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2540)> socket: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2541)> timeout: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2542)> finish: [Function: requestOnFinish]

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2543)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2544)> _eventsCount: 7,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2545)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2546)> outputData: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2547)> outputSize: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2548)> writable: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2549)> destroyed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2550)> _last: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2551)> chunkedEncoding: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2552)> shouldKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2553)> maxRequestsOnConnectionReached: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2554)> _defaultKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2555)> useChunkedEncodingByDefault: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2556)> sendDate: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2557)> _removedConnection: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2558)> _removedContLen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2559)> _removedTE: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2560)> strictContentLength: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2561)> _contentLength: 422,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2562)> _hasBody: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2563)> _trailer: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2564)> finished: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2565)> _headerSent: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2566)> _closed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2567)> _header: 'POST /ted HTTP/1.1\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2568)> 'Accept: application/json, text/plain, */*\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2569)> 'Content-Type: application/json\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2570)> 'User-Agent: axios/1.9.0\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2571)> 'Content-Length: 422\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2572)> 'Accept-Encoding: gzip, compress, deflate, br\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2573)> 'Host: 127.0.0.1:9199\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2574)> 'Connection: keep-alive\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2575)> '\r\n',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2576)> _keepAliveTimeout: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2577)> _onPendingData: [Function: nop],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2578)> agent: Agent {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2579)> _events: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2580)> _eventsCount: 2,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2581)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2582)> options: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2583)> defaultPort: 80,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2584)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2585)> requests: [Object: null prototype] {},

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2586)> sockets: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2587)> freeSockets: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2588)> keepAliveMsecs: 1000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2589)> keepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2590)> maxSockets: Infinity,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2591)> maxFreeSockets: 256,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2592)> scheduling: 'lifo',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2593)> maxTotalSockets: Infinity,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2594)> totalSocketCount: 4,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2595)> agentKeepAliveTimeoutBuffer: 1000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2596)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2597)> Symbol(kCapture): false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2598)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2599)> socketPath: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2600)> method: 'POST',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2601)> maxHeaderSize: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2602)> insecureHTTPParser: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2603)> httpValidation: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2604)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2605)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2606)> res: IncomingMessage {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2607)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2608)> _readableState: [ReadableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2609)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2610)> socket: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2611)> httpVersionMajor: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2612)> httpVersionMinor: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2613)> httpVersion: '1.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2614)> complete: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2615)> rawHeaders: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2616)> rawTrailers: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2617)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2618)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2619)> upgrade: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2620)> url: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2621)> method: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2622)> statusCode: 500,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2623)> statusMessage: 'Internal Server Error',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2624)> client: [Socket],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2625)> _consuming: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2626)> _dumped: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2627)> req: [Circular *1],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2628)> _eventsCount: 4,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2629)> responseUrl: '[http://127.0.0.1:9199/ted](http://127.0.0.1:9199/ted)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2630)> redirects: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2631)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2632)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2633)> Symbol(kHeaders): [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2634)> Symbol(kHeadersCount): 10,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2635)> Symbol(kTrailers): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2636)> Symbol(kTrailersCount): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2637)> Symbol(kAbortController): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2638)> Symbol(kAbortSignalSocket): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2639)> Symbol(kAbortSignalListener): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2640)> Symbol(kAbortSignalDetached): true

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2641)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2642)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2643)> timeoutCb: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2644)> upgradeOrConnect: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2645)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2646)> maxHeadersCount: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2647)> reusedSocket: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2648)> host: '127.0.0.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2649)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2650)> _redirectable: Writable {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2651)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2652)> _writableState: [WritableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2653)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2654)> _options: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2655)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2656)> _ending: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2657)> _redirectCount: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2658)> _redirects: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2659)> _requestBodyLength: 422,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2660)> _requestBodyBuffers: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2661)> _eventsCount: 3,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2662)> _onNativeResponse: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2663)> _currentRequest: [Circular *1],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2664)> _currentUrl: '[http://127.0.0.1:9199/ted](http://127.0.0.1:9199/ted)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2665)> _timeout: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2666)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2667)> Symbol(kCapture): false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2668)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2669)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2670)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2671)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2672)> Symbol(kNeedDrain): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2673)> Symbol(corked): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2674)> Symbol(kChunkedBuffer): [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2675)> Symbol(kChunkedLength): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2676)> Symbol(kSocket): Socket {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2677)> connecting: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2678)> _hadError: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2679)> _parent: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2680)> _host: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2681)> _closeAfterHandlingError: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2682)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2683)> _readableState: [ReadableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2684)> _writableState: [WritableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2685)> allowHalfOpen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2686)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2687)> _eventsCount: 6,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2688)> _sockname: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2689)> _pendingData: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2690)> _pendingEncoding: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2691)> server: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2692)> _server: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2693)> timeout: 4000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2694)> _httpMessage: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2695)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2696)> Symbol(async_id_symbol): -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2697)> Symbol(kHandle): [TCP],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2698)> Symbol(lastWriteQueueSize): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2699)> Symbol(timeout): Timeout {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2700)> _idleTimeout: 4000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2701)> _idlePrev: [TimersList],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2702)> _idleNext: [TimersList],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2703)> _idleStart: 1812,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2704)> _onTimeout: [Function: onStreamTimeout],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2705)> _timerArgs: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2706)> _repeat: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2707)> _destroyed: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2708)> Symbol(refed): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2709)> Symbol(kHasPrimitive): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2710)> Symbol(asyncId): 4222,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2711)> Symbol(triggerId): 4220,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2712)> Symbol(kAsyncContextFrame): undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2713)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2714)> Symbol(kBuffer): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2715)> Symbol(kBufferCb): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2716)> Symbol(kBufferGen): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2717)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2718)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2719)> Symbol(kSetNoDelay): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2720)> Symbol(kSetKeepAlive): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2721)> Symbol(kSetKeepAliveInitialDelay): 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2722)> Symbol(kSetTOS): undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2723)> Symbol(kBytesRead): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2724)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2725)> Symbol(kSetKeepAliveInterval): undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2726)> Symbol(kSetKeepAliveCount): undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2727)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2728)> Symbol(kOutHeaders): [Object: null prototype] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2729)> accept: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2730)> 'content-type': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2731)> 'user-agent': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2732)> 'content-length': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2733)> 'accept-encoding': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2734)> host: [Array]

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2735)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2736)> Symbol(errored): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2737)> Symbol(kWritableFinished): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2738)> Symbol(kEndCallbacks): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2739)> Symbol(kFlushError): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2740)> Symbol(kHighWaterMark): 65536,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2741)> Symbol(kRejectNonStandardBodyWrites): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2742)> Symbol(kPath): '/ted',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2743)> Symbol(kProxyRewrittenToAbsolute): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2744)> Symbol(kAuthority): '127.0.0.1:9199',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2745)> Symbol(kUniqueHeaders): null

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2746)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2747)> response: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2748)> status: 500,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2749)> statusText: 'Internal Server Error',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2750)> headers: Object [AxiosHeaders] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2751)> 'content-type': 'application/json',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2752)> date: 'Sun, 08 Nov 2026 12:13:24 GMT',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2753)> connection: 'keep-alive',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2754)> 'keep-alive': 'timeout=5',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2755)> 'transfer-encoding': 'chunked'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2756)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2757)> config: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2758)> transitional: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2759)> adapter: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2760)> transformRequest: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2761)> transformResponse: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2762)> timeout: 30000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2763)> xsrfCookieName: 'XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2764)> xsrfHeaderName: 'X-XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2765)> maxContentLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2766)> maxBodyLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2767)> env: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2768)> validateStatus: [Function: validateStatus],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2769)> headers: [Object [AxiosHeaders]],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2770)> method: 'post',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2771)> url: '[http://127.0.0.1:9199/ted](http://127.0.0.1:9199/ted)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2772)> data: '{"query":"buyer-country=POL AND publication-date=20261106 AND classification-cpv=teeq AND notice-type=cn-standard","fields":["notice-title","classification-cpv","publication-date","publication-number","buyer-city","organisation-name-buyer","authority-main-activity","contract-nature","change-notice-version-identifier","deadline-receipt-tender-date-lot","document-url-lot","internal-identifier-proc"],"page":1,"limit":250}',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2773)> allowAbsoluteUrls: true

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2774)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2775)> request: <ref *1> ClientRequest {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2776)> _events: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2777)> _eventsCount: 7,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2778)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2779)> outputData: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2780)> outputSize: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2781)> writable: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2782)> destroyed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2783)> _last: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2784)> chunkedEncoding: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2785)> shouldKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2786)> maxRequestsOnConnectionReached: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2787)> _defaultKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2788)> useChunkedEncodingByDefault: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2789)> sendDate: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2790)> _removedConnection: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2791)> _removedContLen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2792)> _removedTE: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2793)> strictContentLength: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2794)> _contentLength: 422,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2795)> _hasBody: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2796)> _trailer: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2797)> finished: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2798)> _headerSent: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2799)> _closed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2800)> _header: 'POST /ted HTTP/1.1\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2801)> 'Accept: application/json, text/plain, */*\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2802)> 'Content-Type: application/json\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2803)> 'User-Agent: axios/1.9.0\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2804)> 'Content-Length: 422\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2805)> 'Accept-Encoding: gzip, compress, deflate, br\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2806)> 'Host: 127.0.0.1:9199\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2807)> 'Connection: keep-alive\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2808)> '\r\n',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2809)> _keepAliveTimeout: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2810)> _onPendingData: [Function: nop],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2811)> agent: [Agent],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2812)> socketPath: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2813)> method: 'POST',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2814)> maxHeaderSize: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2815)> insecureHTTPParser: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2816)> httpValidation: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2817)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2818)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2819)> res: [IncomingMessage],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2820)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2821)> timeoutCb: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2822)> upgradeOrConnect: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2823)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2824)> maxHeadersCount: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2825)> reusedSocket: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2826)> host: '127.0.0.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2827)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2828)> _redirectable: [Writable],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2829)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2830)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2831)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2832)> Symbol(kNeedDrain): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2833)> Symbol(corked): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2834)> Symbol(kChunkedBuffer): [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2835)> Symbol(kChunkedLength): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2836)> Symbol(kSocket): [Socket],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2837)> Symbol(kOutHeaders): [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2838)> Symbol(errored): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2839)> Symbol(kWritableFinished): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2840)> Symbol(kEndCallbacks): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2841)> Symbol(kFlushError): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2842)> Symbol(kHighWaterMark): 65536,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2843)> Symbol(kRejectNonStandardBodyWrites): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2844)> Symbol(kPath): '/ted',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2845)> Symbol(kProxyRewrittenToAbsolute): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2846)> Symbol(kAuthority): '127.0.0.1:9199',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2847)> Symbol(kUniqueHeaders): null

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2848)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2849)> data: { error: 'boom' }

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2850)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2851)> status: 500

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2852)> }

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2853)> Błąd pobierania przetargów z eZamówień (Delivery): AxiosError: Request failed with status code 500

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2854)> at settle (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:2049:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2855)> at IncomingMessage.handleStreamEnd (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:3166:11)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2856)> at IncomingMessage.emit (node:events:526:24)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2857)> at endReadableNT (node:internal/streams/readable:1783:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2858)> at process.processTicksAndRejections (node:internal/process/task_queues:90:21)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2859)> at Axios.request (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:4276:41)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2860)> at process.processTicksAndRejections (node:internal/process/task_queues:104:5)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2861)> at async requestWithRetry (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/http.js:29:20)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2862)> at async fetchOrderType (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/ezamowienia.js:64:26)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2863)> at async Promise.allSettled (index 0)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2864)> at async Object.fetchEzamowienia [as E_ZAMOWIENIA] (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/ezamowienia.js:101:21)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2865)> at async Promise.all (index 1)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2866)> at async refreshDay (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/refresh.js:95:25)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2867)> at async /home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/firebase-functions/lib/common/providers/https.js:544:26

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2868)> at async runFunction (/home/runner/work/TED_Tenders/TED_Tenders/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js:506:9) {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2869)> code: 'ERR_BAD_RESPONSE',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2870)> config: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2871)> transitional: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2872)> silentJSONParsing: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2873)> forcedJSONParsing: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2874)> clarifyTimeoutError: false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2875)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2876)> adapter: [ 'xhr', 'http', 'fetch' ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2877)> transformRequest: [ [Function: transformRequest] ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2878)> transformResponse: [ [Function: transformResponse] ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2879)> timeout: 30000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2880)> xsrfCookieName: 'XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2881)> xsrfHeaderName: 'X-XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2882)> maxContentLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2883)> maxBodyLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2884)> env: { FormData: [Function [FormData]], Blob: [class Blob] },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2885)> validateStatus: [Function: validateStatus],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2886)> headers: Object [AxiosHeaders] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2887)> Accept: 'application/json, text/plain, */*',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2888)> 'Content-Type': undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2889)> 'User-Agent': 'axios/1.9.0',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2890)> 'Accept-Encoding': 'gzip, compress, deflate, br'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2891)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2892)> method: 'get',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2893)> url: '[http://127.0.0.1:9199/ezamowienia](http://127.0.0.1:9199/ezamowienia)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2894)> params: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2895)> noticeType: 'ContractNotice',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2896)> isTenderAmountBelowEU: 'true',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2897)> publicationDateFrom: '2026-11-05',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2898)> publicationDateTo: '2026-11-06',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2899)> orderType: 'Delivery',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2900)> SortingColumnName: 'PublicationDate',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2901)> SortingDirection: 'DESC',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2902)> PageNumber: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2903)> PageSize: 10

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2904)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2905)> allowAbsoluteUrls: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2906)> data: undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2907)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2908)> request: <ref *1> ClientRequest {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2909)> _events: [Object: null prototype] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2910)> abort: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2911)> aborted: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2912)> connect: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2913)> error: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2914)> socket: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2915)> timeout: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2916)> finish: [Function: requestOnFinish]

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2917)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2918)> _eventsCount: 7,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2919)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2920)> outputData: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2921)> outputSize: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2922)> writable: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2923)> destroyed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2924)> _last: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2925)> chunkedEncoding: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2926)> shouldKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2927)> maxRequestsOnConnectionReached: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2928)> _defaultKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2929)> useChunkedEncodingByDefault: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2930)> sendDate: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2931)> _removedConnection: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2932)> _removedContLen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2933)> _removedTE: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2934)> strictContentLength: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2935)> _contentLength: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2936)> _hasBody: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2937)> _trailer: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2938)> finished: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2939)> _headerSent: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2940)> _closed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2941)> _header: 'GET /ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Delivery&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10 HTTP/1.1\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2942)> 'Accept: application/json, text/plain, */*\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2943)> 'User-Agent: axios/1.9.0\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2944)> 'Accept-Encoding: gzip, compress, deflate, br\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2945)> 'Host: 127.0.0.1:9199\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2946)> 'Connection: keep-alive\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2947)> '\r\n',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2948)> _keepAliveTimeout: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2949)> _onPendingData: [Function: nop],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2950)> agent: Agent {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2951)> _events: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2952)> _eventsCount: 2,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2953)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2954)> options: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2955)> defaultPort: 80,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2956)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2957)> requests: [Object: null prototype] {},

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2958)> sockets: [Object: null prototype] {},

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2959)> freeSockets: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2960)> keepAliveMsecs: 1000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2961)> keepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2962)> maxSockets: Infinity,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2963)> maxFreeSockets: 256,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2964)> scheduling: 'lifo',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2965)> maxTotalSockets: Infinity,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2966)> totalSocketCount: 4,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2967)> agentKeepAliveTimeoutBuffer: 1000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2968)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2969)> Symbol(kCapture): false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2970)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2971)> socketPath: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2972)> method: 'GET',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2973)> maxHeaderSize: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2974)> insecureHTTPParser: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2975)> httpValidation: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2976)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2977)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2978)> res: IncomingMessage {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2979)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2980)> _readableState: [ReadableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2981)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2982)✔ nie zapisuje dziennika, gdy odświeżenie się nie powiodło (46.480764ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2983)> socket: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2984)> httpVersionMajor: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2985)> httpVersionMinor: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2986)> httpVersion: '1.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2987)> complete: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2988)> rawHeaders: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2989)> rawTrailers: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2990)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2991)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2992)> upgrade: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2993)> url: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2994)> method: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2995)> statusCode: 500,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2996)> statusMessage: 'Internal Server Error',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2997)> client: [Socket],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2998)> _consuming: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:2999)> _dumped: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3000)> req: [Circular *1],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3001)> _eventsCount: 4,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3002)> responseUrl: '[http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Delivery&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10](http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Delivery&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3003)> redirects: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3004)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3005)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3006)> Symbol(kHeaders): [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3007)> Symbol(kHeadersCount): 10,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3008)> Symbol(kTrailers): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3009)> Symbol(kTrailersCount): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3010)> Symbol(kAbortController): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3011)> Symbol(kAbortSignalSocket): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3012)> Symbol(kAbortSignalListener): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3013)> Symbol(kAbortSignalDetached): true

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3014)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3015)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3016)> timeoutCb: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3017)> upgradeOrConnect: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3018)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3019)> maxHeadersCount: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3020)> reusedSocket: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3021)> host: '127.0.0.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3022)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3023)> _redirectable: Writable {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3024)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3025)> _writableState: [WritableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3026)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3027)> _options: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3028)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3029)> _ending: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3030)> _redirectCount: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3031)> _redirects: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3032)> _requestBodyLength: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3033)> _requestBodyBuffers: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3034)> _eventsCount: 3,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3035)> _onNativeResponse: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3036)> _currentRequest: [Circular *1],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3037)> _currentUrl: '[http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Delivery&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10](http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Delivery&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3038)> _timeout: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3039)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3040)> Symbol(kCapture): false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3041)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3042)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3043)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3044)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3045)> Symbol(kNeedDrain): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3046)> Symbol(corked): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3047)> Symbol(kChunkedBuffer): [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3048)> Symbol(kChunkedLength): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3049)> Symbol(kSocket): Socket {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3050)> connecting: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3051)> _hadError: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3052)> _parent: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3053)> _host: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3054)> _closeAfterHandlingError: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3055)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3056)> _readableState: [ReadableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3057)> _writableState: [WritableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3058)> allowHalfOpen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3059)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3060)> _eventsCount: 6,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3061)> _sockname: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3062)> _pendingData: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3063)> _pendingEncoding: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3064)> server: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3065)> _server: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3066)> timeout: 4000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3067)> _httpMessage: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3068)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3069)> Symbol(async_id_symbol): -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3070)> Symbol(kHandle): [TCP],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3071)> Symbol(lastWriteQueueSize): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3072)> Symbol(timeout): Timeout {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3073)> _idleTimeout: 4000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3074)> _idlePrev: [Timeout],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3075)> _idleNext: [Timeout],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3076)> _idleStart: 1813,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3077)> _onTimeout: [Function: onStreamTimeout],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3078)> _timerArgs: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3079)> _repeat: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3080)> _destroyed: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3081)> Symbol(refed): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3082)> Symbol(kHasPrimitive): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3083)> Symbol(asyncId): 4231,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3084)> Symbol(triggerId): 4229,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3085)> Symbol(kAsyncContextFrame): undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3086)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3087)> Symbol(kBuffer): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3088)> Symbol(kBufferCb): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3089)> Symbol(kBufferGen): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3090)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3091)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3092)> Symbol(kSetNoDelay): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3093)> Symbol(kSetKeepAlive): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3094)> Symbol(kSetKeepAliveInitialDelay): 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3095)> Symbol(kSetTOS): undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3096)> Symbol(kBytesRead): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3097)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3098)> Symbol(kSetKeepAliveInterval): undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3099)> Symbol(kSetKeepAliveCount): undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3100)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3101)> Symbol(kOutHeaders): [Object: null prototype] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3102)> accept: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3103)> 'user-agent': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3104)> 'accept-encoding': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3105)> host: [Array]

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3106)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3107)> Symbol(errored): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3108)> Symbol(kWritableFinished): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3109)> Symbol(kEndCallbacks): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3110)> Symbol(kFlushError): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3111)> Symbol(kHighWaterMark): 65536,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3112)> Symbol(kRejectNonStandardBodyWrites): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3113)> Symbol(kPath): '/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Delivery&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3114)> Symbol(kProxyRewrittenToAbsolute): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3115)> Symbol(kAuthority): '127.0.0.1:9199',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3116)> Symbol(kUniqueHeaders): null

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3117)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3118)> response: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3119)> status: 500,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3120)> statusText: 'Internal Server Error',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3121)> headers: Object [AxiosHeaders] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3122)> 'content-type': 'application/json',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3123)> date: 'Sun, 08 Nov 2026 12:13:24 GMT',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3124)> connection: 'keep-alive',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3125)> 'keep-alive': 'timeout=5',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3126)> 'transfer-encoding': 'chunked'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3127)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3128)> config: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3129)> transitional: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3130)> adapter: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3131)> transformRequest: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3132)> transformResponse: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3133)> timeout: 30000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3134)> xsrfCookieName: 'XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3135)> xsrfHeaderName: 'X-XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3136)> maxContentLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3137)> maxBodyLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3138)> env: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3139)> validateStatus: [Function: validateStatus],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3140)> headers: [Object [AxiosHeaders]],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3141)> method: 'get',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3142)> url: '[http://127.0.0.1:9199/ezamowienia](http://127.0.0.1:9199/ezamowienia)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3143)> params: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3144)> allowAbsoluteUrls: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3145)> data: undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3146)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3147)> request: <ref *1> ClientRequest {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3148)> _events: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3149)> _eventsCount: 7,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3150)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3151)> outputData: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3152)> outputSize: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3153)> writable: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3154)> destroyed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3155)> _last: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3156)> chunkedEncoding: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3157)> shouldKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3158)> maxRequestsOnConnectionReached: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3159)> _defaultKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3160)> useChunkedEncodingByDefault: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3161)> sendDate: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3162)> _removedConnection: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3163)> _removedContLen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3164)> _removedTE: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3165)> strictContentLength: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3166)> _contentLength: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3167)> _hasBody: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3168)> _trailer: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3169)> finished: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3170)> _headerSent: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3171)> _closed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3172)> _header: 'GET /ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Delivery&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10 HTTP/1.1\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3173)> 'Accept: application/json, text/plain, */*\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3174)> 'User-Agent: axios/1.9.0\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3175)> 'Accept-Encoding: gzip, compress, deflate, br\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3176)> 'Host: 127.0.0.1:9199\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3177)> 'Connection: keep-alive\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3178)> '\r\n',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3179)> _keepAliveTimeout: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3180)> _onPendingData: [Function: nop],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3181)> agent: [Agent],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3182)> socketPath: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3183)> method: 'GET',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3184)> maxHeaderSize: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3185)> insecureHTTPParser: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3186)> httpValidation: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3187)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3188)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3189)> res: [IncomingMessage],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3190)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3191)> timeoutCb: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3192)> upgradeOrConnect: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3193)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3194)> maxHeadersCount: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3195)> reusedSocket: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3196)> host: '127.0.0.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3197)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3198)> _redirectable: [Writable],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3199)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3200)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3201)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3202)> Symbol(kNeedDrain): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3203)> Symbol(corked): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3204)> Symbol(kChunkedBuffer): [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3205)> Symbol(kChunkedLength): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3206)> Symbol(kSocket): [Socket],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3207)> Symbol(kOutHeaders): [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3208)> Symbol(errored): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3209)> Symbol(kWritableFinished): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3210)> Symbol(kEndCallbacks): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3211)> Symbol(kFlushError): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3212)> Symbol(kHighWaterMark): 65536,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3213)> Symbol(kRejectNonStandardBodyWrites): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3214)> Symbol(kPath): '/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Delivery&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3215)> Symbol(kProxyRewrittenToAbsolute): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3216)> Symbol(kAuthority): '127.0.0.1:9199',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3217)> Symbol(kUniqueHeaders): null

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3218)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3219)> data: { error: 'boom' }

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3220)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3221)> status: 500

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3222)> }

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3223)> Błąd pobierania przetargów z eZamówień (Services): AxiosError: Request failed with status code 500

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3224)> at settle (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:2049:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3225)> at IncomingMessage.handleStreamEnd (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:3166:11)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3226)> at IncomingMessage.emit (node:events:526:24)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3227)> at endReadableNT (node:internal/streams/readable:1783:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3228)> at process.processTicksAndRejections (node:internal/process/task_queues:90:21)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3229)> at Axios.request (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:4276:41)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3230)> at process.processTicksAndRejections (node:internal/process/task_queues:104:5)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3231)> at async requestWithRetry (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/http.js:29:20)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3232)> at async fetchOrderType (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/ezamowienia.js:64:26)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3233)> at async Promise.allSettled (index 1)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3234)> at async Object.fetchEzamowienia [as E_ZAMOWIENIA] (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/ezamowienia.js:101:21)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3235)> at async Promise.all (index 1)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3236)> at async refreshDay (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/refresh.js:95:25)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3237)> at async /home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/firebase-functions/lib/common/providers/https.js:544:26

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3238)> at async runFunction (/home/runner/work/TED_Tenders/TED_Tenders/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js:506:9) {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3239)> code: 'ERR_BAD_RESPONSE',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3240)> config: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3241)> transitional: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3242)> silentJSONParsing: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3243)> forcedJSONParsing: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3244)> clarifyTimeoutError: false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3245)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3246)> adapter: [ 'xhr', 'http', 'fetch' ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3247)> transformRequest: [ [Function: transformRequest] ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3248)> transformResponse: [ [Function: transformResponse] ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3249)> timeout: 30000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3250)> xsrfCookieName: 'XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3251)> xsrfHeaderName: 'X-XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3252)> maxContentLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3253)> maxBodyLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3254)> env: { FormData: [Function [FormData]], Blob: [class Blob] },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3255)> validateStatus: [Function: validateStatus],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3256)> headers: Object [AxiosHeaders] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3257)> Accept: 'application/json, text/plain, */*',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3258)> 'Content-Type': undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3259)> 'User-Agent': 'axios/1.9.0',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3260)> 'Accept-Encoding': 'gzip, compress, deflate, br'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3261)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3262)> method: 'get',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3263)> url: '[http://127.0.0.1:9199/ezamowienia](http://127.0.0.1:9199/ezamowienia)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3264)> params: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3265)> noticeType: 'ContractNotice',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3266)> isTenderAmountBelowEU: 'true',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3267)> publicationDateFrom: '2026-11-05',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3268)> publicationDateTo: '2026-11-06',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3269)> orderType: 'Services',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3270)> SortingColumnName: 'PublicationDate',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3271)> SortingDirection: 'DESC',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3272)> PageNumber: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3273)> PageSize: 10

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3274)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3275)> allowAbsoluteUrls: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3276)> data: undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3277)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3278)> request: <ref *1> ClientRequest {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3279)> _events: [Object: null prototype] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3280)> abort: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3281)> aborted: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3282)> connect: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3283)> error: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3284)> socket: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3285)> timeout: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3286)> finish: [Function: requestOnFinish]

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3287)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3288)> _eventsCount: 7,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3289)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3290)> outputData: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3291)> outputSize: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3292)> writable: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3293)> destroyed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3294)> _last: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3295)> chunkedEncoding: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3296)> shouldKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3297)> maxRequestsOnConnectionReached: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3298)> _defaultKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3299)> useChunkedEncodingByDefault: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3300)> sendDate: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3301)> _removedConnection: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3302)> _removedContLen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3303)> _removedTE: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3304)> strictContentLength: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3305)> _contentLength: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3306)> _hasBody: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3307)> _trailer: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3308)> finished: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3309)> _headerSent: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3310)> _closed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3311)> _header: 'GET /ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Services&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10 HTTP/1.1\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3312)> 'Accept: application/json, text/plain, */*\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3313)> 'User-Agent: axios/1.9.0\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3314)> 'Accept-Encoding: gzip, compress, deflate, br\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3315)> 'Host: 127.0.0.1:9199\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3316)> 'Connection: keep-alive\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3317)> '\r\n',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3318)> _keepAliveTimeout: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3319)> _onPendingData: [Function: nop],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3320)> agent: Agent {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3321)> _events: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3322)> _eventsCount: 2,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3323)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3324)> options: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3325)> defaultPort: 80,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3326)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3327)> requests: [Object: null prototype] {},

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3328)> sockets: [Object: null prototype] {},

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3329)> freeSockets: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3330)> keepAliveMsecs: 1000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3331)> keepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3332)> maxSockets: Infinity,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3333)> maxFreeSockets: 256,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3334)> scheduling: 'lifo',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3335)> maxTotalSockets: Infinity,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3336)> totalSocketCount: 4,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3337)> agentKeepAliveTimeoutBuffer: 1000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3338)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3339)> Symbol(kCapture): false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3340)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3341)> socketPath: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3342)> method: 'GET',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3343)> maxHeaderSize: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3344)> insecureHTTPParser: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3345)> httpValidation: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3346)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3347)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3348)> res: IncomingMessage {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3349)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3350)> _readableState: [ReadableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3351)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3352)> socket: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3353)> httpVersionMajor: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3354)> httpVersionMinor: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3355)> httpVersion: '1.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3356)> complete: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3357)> rawHeaders: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3358)> rawTrailers: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3359)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3360)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3361)> upgrade: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3362)> url: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3363)> method: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3364)> statusCode: 500,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3365)> statusMessage: 'Internal Server Error',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3366)> client: [Socket],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3367)> _consuming: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3368)> _dumped: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3369)> req: [Circular *1],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3370)> _eventsCount: 4,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3371)> responseUrl: '[http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Services&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10](http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Services&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3372)> redirects: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3373)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3374)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3375)> Symbol(kHeaders): [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3376)> Symbol(kHeadersCount): 10,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3377)> Symbol(kTrailers): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3378)> Symbol(kTrailersCount): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3379)> Symbol(kAbortController): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3380)> Symbol(kAbortSignalSocket): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3381)> Symbol(kAbortSignalListener): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3382)> Symbol(kAbortSignalDetached): true

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3383)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3384)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3385)> timeoutCb: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3386)> upgradeOrConnect: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3387)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3388)> maxHeadersCount: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3389)> reusedSocket: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3390)> host: '127.0.0.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3391)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3392)> _redirectable: Writable {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3393)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3394)> _writableState: [WritableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3395)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3396)> _options: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3397)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3398)> _ending: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3399)> _redirectCount: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3400)> _redirects: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3401)> _requestBodyLength: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3402)> _requestBodyBuffers: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3403)> _eventsCount: 3,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3404)> _onNativeResponse: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3405)> _currentRequest: [Circular *1],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3406)> _currentUrl: '[http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Services&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10](http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Services&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3407)> _timeout: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3408)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3409)> Symbol(kCapture): false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3410)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3411)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3412)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3413)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3414)> Symbol(kNeedDrain): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3415)> Symbol(corked): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3416)> Symbol(kChunkedBuffer): [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3417)> Symbol(kChunkedLength): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3418)> Symbol(kSocket): Socket {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3419)> connecting: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3420)> _hadError: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3421)> _parent: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3422)> _host: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3423)> _closeAfterHandlingError: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3424)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3425)> _readableState: [ReadableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3426)> _writableState: [WritableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3427)> allowHalfOpen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3428)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3429)> _eventsCount: 6,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3430)> _sockname: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3431)> _pendingData: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3432)> _pendingEncoding: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3433)> server: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3434)> _server: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3435)> timeout: 4000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3436)> _httpMessage: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3437)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3438)> Symbol(async_id_symbol): -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3439)> Symbol(kHandle): [TCP],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3440)> Symbol(lastWriteQueueSize): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3441)> Symbol(timeout): Timeout {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3442)> _idleTimeout: 4000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3443)> _idlePrev: [Timeout],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3444)> _idleNext: [Timeout],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3445)> _idleStart: 1813,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3446)> _onTimeout: [Function: onStreamTimeout],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3447)> _timerArgs: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3448)> _repeat: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3449)> _destroyed: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3450)> Symbol(refed): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3451)> Symbol(kHasPrimitive): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3452)> Symbol(asyncId): 4239,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3453)> Symbol(triggerId): 4237,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3454)> Symbol(kAsyncContextFrame): undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3455)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3456)> Symbol(kBuffer): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3457)> Symbol(kBufferCb): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3458)> Symbol(kBufferGen): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3459)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3460)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3461)> Symbol(kSetNoDelay): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3462)> Symbol(kSetKeepAlive): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3463)> Symbol(kSetKeepAliveInitialDelay): 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3464)> Symbol(kSetTOS): undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3465)> Symbol(kBytesRead): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3466)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3467)> Symbol(kSetKeepAliveInterval): undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3468)> Symbol(kSetKeepAliveCount): undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3469)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3470)> Symbol(kOutHeaders): [Object: null prototype] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3471)> accept: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3472)> 'user-agent': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3473)> 'accept-encoding': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3474)> host: [Array]

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3475)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3476)> Symbol(errored): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3477)> Symbol(kWritableFinished): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3478)> Symbol(kEndCallbacks): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3479)> Symbol(kFlushError): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3480)> Symbol(kHighWaterMark): 65536,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3481)> Symbol(kRejectNonStandardBodyWrites): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3482)> Symbol(kPath): '/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Services&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3483)> Symbol(kProxyRewrittenToAbsolute): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3484)> Symbol(kAuthority): '127.0.0.1:9199',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3485)> Symbol(kUniqueHeaders): null

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3486)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3487)> response: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3488)> status: 500,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3489)> statusText: 'Internal Server Error',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3490)> headers: Object [AxiosHeaders] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3491)> 'content-type': 'application/json',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3492)> date: 'Sun, 08 Nov 2026 12:13:24 GMT',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3493)> connection: 'keep-alive',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3494)> 'keep-alive': 'timeout=5',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3495)> 'transfer-encoding': 'chunked'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3496)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3497)> config: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3498)> transitional: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3499)> adapter: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3500)> transformRequest: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3501)> transformResponse: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3502)> timeout: 30000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3503)> xsrfCookieName: 'XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3504)> xsrfHeaderName: 'X-XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3505)> maxContentLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3506)> maxBodyLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3507)> env: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3508)> validateStatus: [Function: validateStatus],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3509)> headers: [Object [AxiosHeaders]],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3510)> method: 'get',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3511)> url: '[http://127.0.0.1:9199/ezamowienia](http://127.0.0.1:9199/ezamowienia)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3512)> params: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3513)> allowAbsoluteUrls: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3514)> data: undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3515)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3516)> request: <ref *1> ClientRequest {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3517)> _events: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3518)> _eventsCount: 7,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3519)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3520)> outputData: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3521)> outputSize: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3522)> writable: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3523)> destroyed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3524)> _last: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3525)> chunkedEncoding: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3526)> shouldKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3527)> maxRequestsOnConnectionReached: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3528)> _defaultKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3529)> useChunkedEncodingByDefault: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3530)> sendDate: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3531)> _removedConnection: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3532)> _removedContLen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3533)> _removedTE: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3534)> strictContentLength: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3535)> _contentLength: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3536)> _hasBody: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3537)> _trailer: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3538)> finished: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3539)> _headerSent: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3540)> _closed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3541)> _header: 'GET /ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Services&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10 HTTP/1.1\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3542)> 'Accept: application/json, text/plain, */*\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3543)> 'User-Agent: axios/1.9.0\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3544)> 'Accept-Encoding: gzip, compress, deflate, br\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3545)> 'Host: 127.0.0.1:9199\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3546)> 'Connection: keep-alive\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3547)> '\r\n',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3548)> _keepAliveTimeout: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3549)> _onPendingData: [Function: nop],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3550)> agent: [Agent],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3551)> socketPath: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3552)> method: 'GET',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3553)> maxHeaderSize: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3554)> insecureHTTPParser: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3555)> httpValidation: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3556)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3557)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3558)> res: [IncomingMessage],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3559)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3560)> timeoutCb: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3561)> upgradeOrConnect: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3562)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3563)> maxHeadersCount: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3564)> reusedSocket: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3565)> host: '127.0.0.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3566)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3567)> _redirectable: [Writable],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3568)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3569)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3570)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3571)> Symbol(kNeedDrain): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3572)> Symbol(corked): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3573)> Symbol(kChunkedBuffer): [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3574)> Symbol(kChunkedLength): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3575)> Symbol(kSocket): [Socket],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3576)> Symbol(kOutHeaders): [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3577)> Symbol(errored): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3578)> Symbol(kWritableFinished): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3579)> Symbol(kEndCallbacks): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3580)> Symbol(kFlushError): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3581)> Symbol(kHighWaterMark): 65536,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3582)> Symbol(kRejectNonStandardBodyWrites): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3583)> Symbol(kPath): '/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Services&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3584)> Symbol(kProxyRewrittenToAbsolute): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3585)> Symbol(kAuthority): '127.0.0.1:9199',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3586)> Symbol(kUniqueHeaders): null

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3587)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3588)> data: { error: 'boom' }

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3589)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3590)> status: 500

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3591)> }

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3592)> Błąd pobierania przetargów z eZamówień (Works): AxiosError: Request failed with status code 500

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3593)> at settle (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:2049:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3594)> at IncomingMessage.handleStreamEnd (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:3166:11)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3595)> at IncomingMessage.emit (node:events:526:24)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3596)> at endReadableNT (node:internal/streams/readable:1783:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3597)> at process.processTicksAndRejections (node:internal/process/task_queues:90:21)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3598)> at Axios.request (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:4276:41)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3599)> at process.processTicksAndRejections (node:internal/process/task_queues:104:5)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3600)> at async requestWithRetry (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/http.js:29:20)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3601)> at async fetchOrderType (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/ezamowienia.js:64:26)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3602)> at async Promise.allSettled (index 2)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3603)> at async Object.fetchEzamowienia [as E_ZAMOWIENIA] (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/ezamowienia.js:101:21)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3604)> at async Promise.all (index 1)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3605)> at async refreshDay (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/refresh.js:95:25)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3606)> at async /home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/firebase-functions/lib/common/providers/https.js:544:26

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3607)> at async runFunction (/home/runner/work/TED_Tenders/TED_Tenders/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js:506:9) {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3608)> code: 'ERR_BAD_RESPONSE',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3609)> config: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3610)> transitional: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3611)> silentJSONParsing: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3612)> forcedJSONParsing: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3613)> clarifyTimeoutError: false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3614)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3615)> adapter: [ 'xhr', 'http', 'fetch' ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3616)> transformRequest: [ [Function: transformRequest] ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3617)> transformResponse: [ [Function: transformResponse] ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3618)> timeout: 30000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3619)> xsrfCookieName: 'XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3620)> xsrfHeaderName: 'X-XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3621)> maxContentLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3622)> maxBodyLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3623)> env: { FormData: [Function [FormData]], Blob: [class Blob] },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3624)> validateStatus: [Function: validateStatus],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3625)> headers: Object [AxiosHeaders] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3626)> Accept: 'application/json, text/plain, */*',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3627)> 'Content-Type': undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3628)> 'User-Agent': 'axios/1.9.0',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3629)> 'Accept-Encoding': 'gzip, compress, deflate, br'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3630)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3631)> method: 'get',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3632)> url: '[http://127.0.0.1:9199/ezamowienia](http://127.0.0.1:9199/ezamowienia)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3633)> params: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3634)> noticeType: 'ContractNotice',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3635)> isTenderAmountBelowEU: 'true',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3636)> publicationDateFrom: '2026-11-05',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3637)> publicationDateTo: '2026-11-06',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3638)> orderType: 'Works',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3639)> SortingColumnName: 'PublicationDate',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3640)> SortingDirection: 'DESC',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3641)> PageNumber: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3642)> PageSize: 10

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3643)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3644)> allowAbsoluteUrls: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3645)> data: undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3646)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3647)> request: <ref *1> ClientRequest {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3648)> _events: [Object: null prototype] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3649)> abort: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3650)> aborted: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3651)> connect: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3652)> error: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3653)> socket: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3654)> timeout: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3655)> finish: [Function: requestOnFinish]

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3656)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3657)> _eventsCount: 7,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3658)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3659)> outputData: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3660)> outputSize: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3661)> writable: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3662)> destroyed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3663)> _last: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3664)> chunkedEncoding: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3665)> shouldKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3666)> maxRequestsOnConnectionReached: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3667)> _defaultKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3668)> useChunkedEncodingByDefault: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3669)> sendDate: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3670)> _removedConnection: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3671)> _removedContLen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3672)> _removedTE: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3673)> strictContentLength: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3674)> _contentLength: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3675)> _hasBody: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3676)> _trailer: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3677)> finished: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3678)> _headerSent: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3679)> _closed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3680)> _header: 'GET /ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Works&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10 HTTP/1.1\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3681)> 'Accept: application/json, text/plain, */*\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3682)> 'User-Agent: axios/1.9.0\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3683)> 'Accept-Encoding: gzip, compress, deflate, br\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3684)> 'Host: 127.0.0.1:9199\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3685)> 'Connection: keep-alive\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3686)> '\r\n',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3687)> _keepAliveTimeout: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3688)> _onPendingData: [Function: nop],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3689)> agent: Agent {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3690)> _events: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3691)> _eventsCount: 2,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3692)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3693)> options: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3694)> defaultPort: 80,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3695)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3696)> requests: [Object: null prototype] {},

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3697)> sockets: [Object: null prototype] {},

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3698)> freeSockets: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3699)> keepAliveMsecs: 1000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3700)> keepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3701)> maxSockets: Infinity,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3702)> maxFreeSockets: 256,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3703)> scheduling: 'lifo',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3704)> maxTotalSockets: Infinity,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3705)> totalSocketCount: 4,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3706)> agentKeepAliveTimeoutBuffer: 1000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3707)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3708)> Symbol(kCapture): false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3709)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3710)> socketPath: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3711)> method: 'GET',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3712)> maxHeaderSize: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3713)> insecureHTTPParser: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3714)> httpValidation: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3715)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3716)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3717)> res: IncomingMessage {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3718)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3719)> _readableState: [ReadableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3720)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3721)> socket: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3722)> httpVersionMajor: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3723)> httpVersionMinor: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3724)> httpVersion: '1.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3725)> complete: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3726)> rawHeaders: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3727)> rawTrailers: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3728)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3729)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3730)> upgrade: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3731)> url: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3732)> method: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3733)> statusCode: 500,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3734)> statusMessage: 'Internal Server Error',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3735)> client: [Socket],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3736)> _consuming: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3737)> _dumped: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3738)> req: [Circular *1],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3739)> _eventsCount: 4,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3740)> responseUrl: '[http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Works&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10](http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Works&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3741)> redirects: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3742)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3743)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3744)> Symbol(kHeaders): [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3745)> Symbol(kHeadersCount): 10,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3746)> Symbol(kTrailers): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3747)> Symbol(kTrailersCount): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3748)> Symbol(kAbortController): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3749)> Symbol(kAbortSignalSocket): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3750)> Symbol(kAbortSignalListener): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3751)> Symbol(kAbortSignalDetached): true

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3752)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3753)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3754)> timeoutCb: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3755)> upgradeOrConnect: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3756)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3757)> maxHeadersCount: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3758)> reusedSocket: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3759)> host: '127.0.0.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3760)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3761)> _redirectable: Writable {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3762)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3763)> _writableState: [WritableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3764)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3765)> _options: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3766)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3767)> _ending: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3768)> _redirectCount: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3769)> _redirects: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3770)> _requestBodyLength: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3771)> _requestBodyBuffers: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3772)> _eventsCount: 3,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3773)> _onNativeResponse: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3774)> _currentRequest: [Circular *1],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3775)> _currentUrl: '[http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Works&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10](http://127.0.0.1:9199/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Works&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3776)> _timeout: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3777)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3778)> Symbol(kCapture): false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3779)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3780)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3781)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3782)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3783)> Symbol(kNeedDrain): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3784)> Symbol(corked): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3785)> Symbol(kChunkedBuffer): [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3786)> Symbol(kChunkedLength): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3787)> Symbol(kSocket): Socket {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3788)> connecting: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3789)> _hadError: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3790)> _parent: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3791)> _host: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3792)> _closeAfterHandlingError: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3793)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3794)> _readableState: [ReadableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3795)> _writableState: [WritableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3796)> allowHalfOpen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3797)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3798)> _eventsCount: 6,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3799)> _sockname: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3800)> _pendingData: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3801)> _pendingEncoding: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3802)> server: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3803)> _server: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3804)> timeout: 4000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3805)> _httpMessage: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3806)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3807)> Symbol(async_id_symbol): -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3808)> Symbol(kHandle): [TCP],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3809)> Symbol(lastWriteQueueSize): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3810)> Symbol(timeout): Timeout {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3811)> _idleTimeout: 4000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3812)> _idlePrev: [TimersList],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3813)> _idleNext: [Timeout],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3814)> _idleStart: 1813,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3815)> _onTimeout: [Function: onStreamTimeout],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3816)> _timerArgs: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3817)> _repeat: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3818)> _destroyed: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3819)> Symbol(refed): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3820)> Symbol(kHasPrimitive): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3821)> Symbol(asyncId): 4247,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3822)> Symbol(triggerId): 4245,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3823)> Symbol(kAsyncContextFrame): undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3824)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3825)> Symbol(kBuffer): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3826)> Symbol(kBufferCb): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3827)> Symbol(kBufferGen): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3828)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3829)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3830)> Symbol(kSetNoDelay): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3831)> Symbol(kSetKeepAlive): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3832)> Symbol(kSetKeepAliveInitialDelay): 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3833)> Symbol(kSetTOS): undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3834)> Symbol(kBytesRead): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3835)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3836)> Symbol(kSetKeepAliveInterval): undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3837)> Symbol(kSetKeepAliveCount): undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3838)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3839)> Symbol(kOutHeaders): [Object: null prototype] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3840)> accept: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3841)> 'user-agent': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3842)> 'accept-encoding': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3843)> host: [Array]

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3844)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3845)> Symbol(errored): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3846)> Symbol(kWritableFinished): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3847)> Symbol(kEndCallbacks): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3848)> Symbol(kFlushError): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3849)> Symbol(kHighWaterMark): 65536,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3850)> Symbol(kRejectNonStandardBodyWrites): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3851)> Symbol(kPath): '/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Works&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3852)> Symbol(kProxyRewrittenToAbsolute): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3853)> Symbol(kAuthority): '127.0.0.1:9199',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3854)> Symbol(kUniqueHeaders): null

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3855)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3856)> response: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3857)> status: 500,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3858)> statusText: 'Internal Server Error',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3859)> headers: Object [AxiosHeaders] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3860)> 'content-type': 'application/json',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3861)> date: 'Sun, 08 Nov 2026 12:13:24 GMT',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3862)> connection: 'keep-alive',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3863)> 'keep-alive': 'timeout=5',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3864)> 'transfer-encoding': 'chunked'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3865)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3866)> config: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3867)> transitional: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3868)> adapter: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3869)> transformRequest: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3870)> transformResponse: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3871)> timeout: 30000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3872)> xsrfCookieName: 'XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3873)> xsrfHeaderName: 'X-XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3874)> maxContentLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3875)> maxBodyLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3876)> env: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3877)> validateStatus: [Function: validateStatus],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3878)> headers: [Object [AxiosHeaders]],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3879)> method: 'get',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3880)> url: '[http://127.0.0.1:9199/ezamowienia](http://127.0.0.1:9199/ezamowienia)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3881)> params: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3882)> allowAbsoluteUrls: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3883)> data: undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3884)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3885)> request: <ref *1> ClientRequest {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3886)> _events: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3887)> _eventsCount: 7,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3888)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3889)> outputData: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3890)> outputSize: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3891)> writable: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3892)> destroyed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3893)> _last: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3894)> chunkedEncoding: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3895)> shouldKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3896)> maxRequestsOnConnectionReached: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3897)> _defaultKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3898)> useChunkedEncodingByDefault: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3899)> sendDate: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3900)> _removedConnection: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3901)> _removedContLen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3902)> _removedTE: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3903)> strictContentLength: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3904)> _contentLength: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3905)> _hasBody: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3906)> _trailer: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3907)> finished: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3908)> _headerSent: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3909)> _closed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3910)> _header: 'GET /ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Works&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10 HTTP/1.1\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3911)> 'Accept: application/json, text/plain, */*\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3912)> 'User-Agent: axios/1.9.0\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3913)> 'Accept-Encoding: gzip, compress, deflate, br\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3914)> 'Host: 127.0.0.1:9199\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3915)> 'Connection: keep-alive\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3916)> '\r\n',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3917)> _keepAliveTimeout: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3918)> _onPendingData: [Function: nop],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3919)> agent: [Agent],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3920)> socketPath: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3921)> method: 'GET',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3922)> maxHeaderSize: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3923)> insecureHTTPParser: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3924)> httpValidation: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3925)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3926)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3927)> res: [IncomingMessage],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3928)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3929)> timeoutCb: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3930)> upgradeOrConnect: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3931)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3932)> maxHeadersCount: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3933)> reusedSocket: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3934)> host: '127.0.0.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3935)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3936)> _redirectable: [Writable],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3937)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3938)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3939)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3940)> Symbol(kNeedDrain): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3941)> Symbol(corked): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3942)> Symbol(kChunkedBuffer): [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3943)✔ nie zapisuje dziennika dnia, w którym jedno ze źródeł zawiodło (45.997958ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3944)> Symbol(kChunkedLength): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3945)> Symbol(kSocket): [Socket],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3946)> Symbol(kOutHeaders): [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3947)> Symbol(errored): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3948)> Symbol(kWritableFinished): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3949)> Symbol(kEndCallbacks): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3950)> Symbol(kFlushError): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3951)> Symbol(kHighWaterMark): 65536,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3952)> Symbol(kRejectNonStandardBodyWrites): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3953)> Symbol(kPath): '/ezamowienia?noticeType=ContractNotice&isTenderAmountBelowEU=true&publicationDateFrom=2026-11-05&publicationDateTo=2026-11-06&orderType=Works&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=10',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3954)> Symbol(kProxyRewrittenToAbsolute): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3955)✖ refreshTenders (2314.051347ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3956)> Symbol(kAuthority): '127.0.0.1:9199',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3957)> Symbol(kUniqueHeaders): null

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3958)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3959)> data: { error: 'boom' }

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3960)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3961)> status: 500

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3962)> }

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3963)i functions: Finished "europe-central2-refreshTenders" in 39.824014ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3964)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3965)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3966)> Błąd pobierania przetargów z TED: AxiosError: Request failed with status code 500

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3967)> at settle (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:2049:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3968)> at IncomingMessage.handleStreamEnd (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:3166:11)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3969)> at IncomingMessage.emit (node:events:526:24)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3970)> at endReadableNT (node:internal/streams/readable:1783:12)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3971)> at process.processTicksAndRejections (node:internal/process/task_queues:90:21)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3972)> at Axios.request (/home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/axios/dist/node/axios.cjs:4276:41)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3973)> at process.processTicksAndRejections (node:internal/process/task_queues:104:5)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3974)> at async requestWithRetry (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/http.js:29:20)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3975)> at async Object.fetchTed [as TED] (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/ted.js:123:30)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3976)> at async Promise.all (index 0)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3977)> at async refreshDay (/home/runner/work/TED_Tenders/TED_Tenders/functions/lib/tenders/refresh.js:95:25)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3978)> at async /home/runner/work/TED_Tenders/TED_Tenders/functions/node_modules/firebase-functions/lib/common/providers/https.js:544:26

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3979)> at async runFunction (/home/runner/work/TED_Tenders/TED_Tenders/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js:506:9)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3980)> at async runHTTPS (/home/runner/work/TED_Tenders/TED_Tenders/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js:531:5)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3981)> at async /home/runner/work/TED_Tenders/TED_Tenders/node_modules/firebase-tools/lib/emulator/functionsEmulatorRuntime.js:694:21 {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3982)> code: 'ERR_BAD_RESPONSE',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3983)> config: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3984)> transitional: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3985)> silentJSONParsing: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3986)> forcedJSONParsing: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3987)> clarifyTimeoutError: false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3988)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3989)> adapter: [ 'xhr', 'http', 'fetch' ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3990)> transformRequest: [ [Function: transformRequest] ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3991)> transformResponse: [ [Function: transformResponse] ],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3992)> timeout: 30000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3993)> xsrfCookieName: 'XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3994)> xsrfHeaderName: 'X-XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3995)> maxContentLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3996)> maxBodyLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3997)> env: { FormData: [Function [FormData]], Blob: [class Blob] },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3998)> validateStatus: [Function: validateStatus],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:3999)> headers: Object [AxiosHeaders] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4000)> Accept: 'application/json, text/plain, */*',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4001)> 'Content-Type': 'application/json',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4002)> 'User-Agent': 'axios/1.9.0',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4003)> 'Content-Length': '422',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4004)> 'Accept-Encoding': 'gzip, compress, deflate, br'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4005)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4006)> method: 'post',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4007)> url: '[http://127.0.0.1:9199/ted](http://127.0.0.1:9199/ted)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4008)> data: '{"query":"buyer-country=POL AND publication-date=20261107 AND classification-cpv=teeq AND notice-type=cn-standard","fields":["notice-title","classification-cpv","publication-date","publication-number","buyer-city","organisation-name-buyer","authority-main-activity","contract-nature","change-notice-version-identifier","deadline-receipt-tender-date-lot","document-url-lot","internal-identifier-proc"],"page":1,"limit":250}',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4009)> allowAbsoluteUrls: true

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4010)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4011)> request: <ref *1> ClientRequest {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4012)> _events: [Object: null prototype] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4013)> abort: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4014)> aborted: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4015)> connect: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4016)> error: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4017)> socket: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4018)> timeout: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4019)> finish: [Function: requestOnFinish]

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4020)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4021)> _eventsCount: 7,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4022)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4023)> outputData: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4024)> outputSize: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4025)> writable: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4026)> destroyed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4027)> _last: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4028)> chunkedEncoding: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4029)> shouldKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4030)> maxRequestsOnConnectionReached: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4031)> _defaultKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4032)> useChunkedEncodingByDefault: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4033)> sendDate: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4034)> _removedConnection: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4035)> _removedContLen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4036)> _removedTE: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4037)> strictContentLength: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4038)> _contentLength: 422,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4039)> _hasBody: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4040)> _trailer: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4041)> finished: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4042)> _headerSent: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4043)> _closed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4044)> _header: 'POST /ted HTTP/1.1\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4045)> 'Accept: application/json, text/plain, */*\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4046)> 'Content-Type: application/json\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4047)> 'User-Agent: axios/1.9.0\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4048)> 'Content-Length: 422\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4049)> 'Accept-Encoding: gzip, compress, deflate, br\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4050)> 'Host: 127.0.0.1:9199\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4051)> 'Connection: keep-alive\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4052)> '\r\n',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4053)> _keepAliveTimeout: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4054)> _onPendingData: [Function: nop],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4055)> agent: Agent {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4056)> _events: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4057)> _eventsCount: 2,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4058)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4059)> options: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4060)> defaultPort: 80,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4061)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4062)> requests: [Object: null prototype] {},

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4063)> sockets: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4064)> freeSockets: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4065)> keepAliveMsecs: 1000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4066)> keepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4067)> maxSockets: Infinity,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4068)> maxFreeSockets: 256,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4069)> scheduling: 'lifo',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4070)> maxTotalSockets: Infinity,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4071)> totalSocketCount: 4,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4072)> agentKeepAliveTimeoutBuffer: 1000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4073)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4074)> Symbol(kCapture): false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4075)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4076)> socketPath: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4077)> method: 'POST',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4078)> maxHeaderSize: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4079)> insecureHTTPParser: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4080)> httpValidation: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4081)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4082)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4083)> res: IncomingMessage {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4084)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4085)> _readableState: [ReadableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4086)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4087)> socket: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4088)> httpVersionMajor: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4089)> httpVersionMinor: 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4090)> httpVersion: '1.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4091)> complete: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4092)> rawHeaders: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4093)> rawTrailers: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4094)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4095)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4096)> upgrade: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4097)> url: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4098)> method: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4099)> statusCode: 500,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4100)> statusMessage: 'Internal Server Error',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4101)> client: [Socket],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4102)> _consuming: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4103)> _dumped: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4104)> req: [Circular *1],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4105)> _eventsCount: 4,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4106)> responseUrl: '[http://127.0.0.1:9199/ted](http://127.0.0.1:9199/ted)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4107)> redirects: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4108)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4109)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4110)> Symbol(kHeaders): [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4111)> Symbol(kHeadersCount): 10,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4112)> Symbol(kTrailers): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4113)> Symbol(kTrailersCount): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4114)> Symbol(kAbortController): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4115)> Symbol(kAbortSignalSocket): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4116)> Symbol(kAbortSignalListener): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4117)> Symbol(kAbortSignalDetached): true

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4118)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4119)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4120)> timeoutCb: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4121)> upgradeOrConnect: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4122)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4123)> maxHeadersCount: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4124)> reusedSocket: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4125)> host: '127.0.0.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4126)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4127)> _redirectable: Writable {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4128)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4129)> _writableState: [WritableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4130)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4131)> _options: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4132)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4133)> _ending: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4134)> _redirectCount: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4135)> _redirects: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4136)> _requestBodyLength: 422,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4137)> _requestBodyBuffers: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4138)> _eventsCount: 3,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4139)> _onNativeResponse: [Function (anonymous)],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4140)> _currentRequest: [Circular *1],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4141)> _currentUrl: '[http://127.0.0.1:9199/ted](http://127.0.0.1:9199/ted)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4142)> _timeout: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4143)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4144)> Symbol(kCapture): false

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4145)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4146)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4147)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4148)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4149)> Symbol(kNeedDrain): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4150)> Symbol(corked): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4151)> Symbol(kChunkedBuffer): [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4152)> Symbol(kChunkedLength): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4153)> Symbol(kSocket): Socket {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4154)> connecting: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4155)> _hadError: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4156)> _parent: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4157)> _host: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4158)> _closeAfterHandlingError: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4159)> _events: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4160)> _readableState: [ReadableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4161)> _writableState: [WritableState],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4162)> allowHalfOpen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4163)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4164)> _eventsCount: 6,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4165)> _sockname: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4166)> _pendingData: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4167)> _pendingEncoding: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4168)> server: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4169)> _server: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4170)> timeout: 4000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4171)> _httpMessage: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4172)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4173)> Symbol(async_id_symbol): -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4174)> Symbol(kHandle): [TCP],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4175)> Symbol(lastWriteQueueSize): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4176)> Symbol(timeout): Timeout {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4177)> _idleTimeout: 4000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4178)> _idlePrev: [TimersList],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4179)> _idleNext: [TimersList],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4180)> _idleStart: 1868,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4181)> _onTimeout: [Function: onStreamTimeout],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4182)> _timerArgs: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4183)> _repeat: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4184)> _destroyed: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4185)> Symbol(refed): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4186)> Symbol(kHasPrimitive): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4187)> Symbol(asyncId): 4406,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4188)> Symbol(triggerId): 4404,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4189)> Symbol(kAsyncContextFrame): undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4190)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4191)> Symbol(kBuffer): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4192)> Symbol(kBufferCb): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4193)> Symbol(kBufferGen): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4194)> Symbol(shapeMode): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4195)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4196)> Symbol(kSetNoDelay): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4197)> Symbol(kSetKeepAlive): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4198)> Symbol(kSetKeepAliveInitialDelay): 1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4199)> Symbol(kSetTOS): undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4200)> Symbol(kBytesRead): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4201)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4202)> Symbol(kSetKeepAliveInterval): undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4203)> Symbol(kSetKeepAliveCount): undefined

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4204)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4205)> Symbol(kOutHeaders): [Object: null prototype] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4206)> accept: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4207)> 'content-type': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4208)> 'user-agent': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4209)> 'content-length': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4210)> 'accept-encoding': [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4211)> host: [Array]

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4212)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4213)> Symbol(errored): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4214)> Symbol(kWritableFinished): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4215)> Symbol(kEndCallbacks): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4216)> Symbol(kFlushError): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4217)> Symbol(kHighWaterMark): 65536,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4218)> Symbol(kRejectNonStandardBodyWrites): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4219)> Symbol(kPath): '/ted',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4220)> Symbol(kProxyRewrittenToAbsolute): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4221)> Symbol(kAuthority): '127.0.0.1:9199',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4222)> Symbol(kUniqueHeaders): null

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4223)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4224)> response: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4225)> status: 500,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4226)> statusText: 'Internal Server Error',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4227)> headers: Object [AxiosHeaders] {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4228)> 'content-type': 'application/json',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4229)> date: 'Sun, 08 Nov 2026 12:13:24 GMT',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4230)> connection: 'keep-alive',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4231)> 'keep-alive': 'timeout=5',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4232)> 'transfer-encoding': 'chunked'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4233)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4234)> config: {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4235)> transitional: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4236)> adapter: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4237)> transformRequest: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4238)> transformResponse: [Array],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4239)> timeout: 30000,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4240)> xsrfCookieName: 'XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4241)> xsrfHeaderName: 'X-XSRF-TOKEN',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4242)> maxContentLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4243)> maxBodyLength: -1,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4244)> env: [Object],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4245)> validateStatus: [Function: validateStatus],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4246)> headers: [Object [AxiosHeaders]],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4247)> method: 'post',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4248)> url: '[http://127.0.0.1:9199/ted](http://127.0.0.1:9199/ted)',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4249)> data: '{"query":"buyer-country=POL AND publication-date=20261107 AND classification-cpv=teeq AND notice-type=cn-standard","fields":["notice-title","classification-cpv","publication-date","publication-number","buyer-city","organisation-name-buyer","authority-main-activity","contract-nature","change-notice-version-identifier","deadline-receipt-tender-date-lot","document-url-lot","internal-identifier-proc"],"page":1,"limit":250}',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4250)> allowAbsoluteUrls: true

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4251)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4252)> request: <ref *1> ClientRequest {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4253)> _events: [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4254)> _eventsCount: 7,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4255)> _maxListeners: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4256)> outputData: [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4257)> outputSize: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4258)> writable: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4259)> destroyed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4260)> _last: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4261)> chunkedEncoding: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4262)> shouldKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4263)> maxRequestsOnConnectionReached: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4264)> _defaultKeepAlive: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4265)> useChunkedEncodingByDefault: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4266)> sendDate: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4267)> _removedConnection: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4268)> _removedContLen: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4269)> _removedTE: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4270)> strictContentLength: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4271)> _contentLength: 422,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4272)> _hasBody: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4273)> _trailer: '',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4274)> finished: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4275)> _headerSent: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4276)> _closed: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4277)> _header: 'POST /ted HTTP/1.1\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4278)> 'Accept: application/json, text/plain, */*\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4279)> 'Content-Type: application/json\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4280)> 'User-Agent: axios/1.9.0\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4281)> 'Content-Length: 422\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4282)> 'Accept-Encoding: gzip, compress, deflate, br\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4283)> 'Host: 127.0.0.1:9199\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4284)> 'Connection: keep-alive\r\n' +

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4285)> '\r\n',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4286)> _keepAliveTimeout: 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4287)> _onPendingData: [Function: nop],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4288)> agent: [Agent],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4289)> socketPath: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4290)> method: 'POST',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4291)> maxHeaderSize: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4292)> insecureHTTPParser: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4293)> httpValidation: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4294)> joinDuplicateHeaders: undefined,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4295)> _ended: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4296)> res: [IncomingMessage],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4297)> aborted: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4298)> timeoutCb: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4299)> upgradeOrConnect: false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4300)> parser: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4301)> maxHeadersCount: null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4302)> reusedSocket: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4303)> host: '127.0.0.1',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4304)> protocol: 'http:',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4305)> _redirectable: [Writable],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4306)> Symbol(shapeMode): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4307)> Symbol(kCapture): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4308)> Symbol(kBytesWritten): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4309)> Symbol(kNeedDrain): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4310)> Symbol(corked): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4311)> Symbol(kChunkedBuffer): [],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4312)> Symbol(kChunkedLength): 0,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4313)> Symbol(kSocket): [Socket],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4314)> Symbol(kOutHeaders): [Object: null prototype],

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4315)> Symbol(errored): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4316)> Symbol(kWritableFinished): true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4317)> Symbol(kEndCallbacks): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4318)> Symbol(kFlushError): null,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4319)> Symbol(kHighWaterMark): 65536,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4320)> Symbol(kRejectNonStandardBodyWrites): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4321)> Symbol(kPath): '/ted',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4322)> Symbol(kProxyRewrittenToAbsolute): false,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4323)> Symbol(kAuthority): '127.0.0.1:9199',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4324)> Symbol(kUniqueHeaders): null

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4325)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4326)> data: { error: 'boom' }

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4327)> },

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4328)> status: 500

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4329)> }

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4330)i functions: Finished "europe-central2-refreshTenders" in 32.268371ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4331)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4332)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4333)i functions: Finished "europe-central2-refreshTenders" in 7.276793ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4334)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4335)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4336)i functions: Finished "europe-central2-refreshTenders" in 1.391043ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4337)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4338)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4339)i functions: Finished "europe-central2-refreshTenders" in 1.08968ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4340)▶ Baza Konkurencyjności

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4341)✔ odrzuca nieprawidłową listę źródeł (21.844061ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4342)✔ domyślne odświeżenie nie odpytuje Bazy (0.163606ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4343)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4344)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4345)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4346)i functions: Finished "europe-central2-refreshTenders" in 32.740502ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4347)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 5.02847ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4348)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4349)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 4.263106ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4350)✔ pobiera nowe ogłoszenia z Bazy na żądanie, bez danych osobowych i bez dziennika dnia (55.705218ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4351)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4352)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4353)i functions: Finished "europe-central2-refreshTenders" in 27.521236ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4354)✔ w ciągu 5 minut pomija Bazę, a TED i eZamówienia odświeża normalnie (29.800426ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4355)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4356)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4357)i functions: Beginning execution of "europe-central2-enqueueDocsCheckOnCreate"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4358)i functions: Finished "europe-central2-refreshTenders" in 30.792209ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4359)i functions: Finished "europe-central2-enqueueDocsCheckOnCreate" in 4.700525ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4360)✔ po upływie 5 minut pobiera szczegóły tylko nowych ogłoszeń (36.827885ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4361)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4362)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4363)i functions: Finished "europe-central2-refreshTenders" in 23.65123ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4364)✔ pomija ogłoszenie wycofane między wyszukiwaniem a pobraniem szczegółów (404) (28.257745ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4365)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4366)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4367)> Błąd pobierania ogłoszeń z Bazy Konkurencyjności: Request failed with status code 500

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4368)i functions: Finished "europe-central2-refreshTenders" in 26.64165ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4369)✔ awaria Bazy nie psuje TED i eZamówień, ale jest zgłoszona i nie przesuwa znacznika (43.396612ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4370)i functions: Beginning execution of "europe-central2-refreshTenders"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4371)> {"verifications":{"app":"MISSING","auth":"VALID"},"logging.googleapis.com/labels":{"firebase-log-type":"callable-request-verification"},"severity":"DEBUG","message":"Callable request verification passed"}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4372)> Błąd pobierania ogłoszeń z Bazy Konkurencyjności: Request failed with status code 500

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4373)i functions: Finished "europe-central2-refreshTenders" in 16.138202ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4374)✔ sam błąd Bazy to awaria "unavailable", a blokada zostaje zwolniona (24.211272ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4375)✔ Baza Konkurencyjności (241.117034ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4376)ℹ tests 46

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4377)ℹ suites 7

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4378)ℹ pass 44

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4379)ℹ fail 2

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4380)ℹ cancelled 0

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4381)ℹ skipped 0

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4382)ℹ todo 0

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4383)ℹ duration_ms 10498.310685

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4384)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4385)✖ failing tests:

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4386)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4387)test at tests/refresh.integration.test.mjs:199:5

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4388)✖ zapisuje przetargi z obu źródeł, z drugą stroną i bez ogłoszeń zmieniających oraz z innych dni (414.10171ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4389)AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4390)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4391)15 !== 14

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4392)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4393)at TestContext.<anonymous> (file:///home/runner/work/TED_Tenders/TED_Tenders/tests/refresh.integration.test.mjs:214:16)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4394)at process.processTicksAndRejections (node:internal/process/task_queues:104:5)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4395)at async Test.run (node:internal/test_runner/test:1409:7)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4396)at async Suite.processPendingSubtests (node:internal/test_runner/test:974:7) {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4397)generatedMessage: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4398)code: 'ERR_ASSERTION',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4399)actual: 15,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4400)expected: 14,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4401)operator: 'strictEqual',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4402)diff: 'simple'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4403)}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4404)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4405)test at tests/refresh.integration.test.mjs:233:5

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4406)✖ przy ponownym odświeżeniu dopisuje tylko nowe i nie rusza istniejących (status zostaje) (86.777499ms)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4407)AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4408)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4409)16 !== 15

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4410)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4411)at TestContext.<anonymous> (file:///home/runner/work/TED_Tenders/TED_Tenders/tests/refresh.integration.test.mjs:242:16)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4412)at process.processTicksAndRejections (node:internal/process/task_queues:104:5)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4413)at async Test.run (node:internal/test_runner/test:1409:7)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4414)at async Suite.processPendingSubtests (node:internal/test_runner/test:974:7) {

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4415)generatedMessage: true,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4416)code: 'ERR_ASSERTION',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4417)actual: 16,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4418)expected: 15,

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4419)operator: 'strictEqual',

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4420)diff: 'simple'

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4421)}

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4422)⚠ Script exited unsuccessfully (code 1)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4423)i functions: Beginning execution of "europe-central2-checkDocumentsTask"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4424)i functions: Finished "europe-central2-checkDocumentsTask" in 13.191135ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4425)i functions: Beginning execution of "europe-central2-snapshotLabelOnStatusChange"

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4426)i functions: Finished "europe-central2-snapshotLabelOnStatusChange" in 1.830956ms

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4427)i emulators: Shutting down emulators.

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4428)i functions: Stopping Functions Emulator

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4429)i firestore: Stopping Firestore Emulator

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4430)i auth: Stopping Authentication Emulator

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4431)i eventarc: Stopping Eventarc Emulator

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4432)i tasks: Stopping Cloud Tasks Emulator

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4433)i hub: Stopping emulator hub

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4434)i logging: Stopping Logging Emulator

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4435)

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4436)Error: Script "node --test --test-concurrency=1 tests/invite.integration.test.mjs tests/refresh.integration.test.mjs tests/labelSnapshot.integration.test.mjs tests/docsCheck.integration.test.mjs" exited with code 1

[](https://github.com/JankesMateusz/TED_Tenders/actions/runs/42478655837/job/128725546462?pr=10#step:8:4437)Error: Process completed with exit code 1.

0s

0s

0s

0s

0s

## Footer

[](https://github.com/)© 2026 GitHub, Inc.

### Footer navigation

- [Terms](https://docs.github.com/site-policy/github-terms/github-terms-of-service)
- [Privacy](https://docs.github.com/site-policy/privacy-policies/github-privacy-statement)
- [Security](https://github.com/security)
- [Status](https://www.githubstatus.com/)
- [Community](https://github.community/)
- [Docs](https://docs.github.com/)
- [Contact](https://support.github.com/?tags=dotcom-footer)
- Manage cookies
- Do not share my personal information