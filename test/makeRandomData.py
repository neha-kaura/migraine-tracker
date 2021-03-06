import random
import datetime
import json 

categories = {
    "Symptoms": [
      {
          "name": "Migraine today",
          "id": "migraineToday",
          "explanation": "Migraine experienced today",
          "fieldDescription": "Whether you had a migraine (yes/no)",
          "field": "binary",
          "recommendingGoals": ["1a", "1b", "1c", "2", "3a", "3b", "3c"]
      },
      {
          "name": "Headache today",
          "id": "headacheToday",
          "explanation": "(Non-migraine) headache experience today",
          "fieldDescription": "Whether you had a headache (yes/no)",
          "field": "binary",
          "recommendingGoals": ["3b", "3c"]
      },
      {
          "name": "Peak Severity",
          "id": "peakMigraineSeverity",
          "explanation": "How bad your migraine was at its worst point",
          "fieldDescription": "10-point Pain level (1=mild, 10=terrible)",
          "field": "numeric scale",
          "recommendingGoals": ["3b", "3c"]
      },
      {
        "name": "Migraine duration",
        "field": "time range",
        "id": "custom_migraineduration",
        "custom": True
      }
    ],
    "Treatments": [
      {
          "name": "As-needed medications today",
          "id": "asNeededMeds",
          "explanation": "Any medication you take on an as-needed basis (in response to symptoms).  For example: Advil, Excedrin, Tylenol, prescription medications you don't take regularly.",
          "fieldDescription": "Whether you took any as-needed medication today",
          "field": "binary",
          "recommendingGoals": ["1a", "1b", "1c", "2", "3a", "3b", "3c"],
          "goal": {
              "freq": "Less",
              "threshold": 4,
              "timespan": "Month"
          }
      },
      {
          "name": "Exercise",
          "id": "exerciseToday",
          "explanation": "How much you exercised today",
          "fieldDescription": "Number of minutes of exercise",
          "field": "number",
          "goal": {
              "freq": "More",
              "threshold": 180,
              "timespan": "Week"
          },
          "recommendingGoals": ["1b", "3b"]
      },
      {
        "name": "Time took advil",
        "field": "time",
        "id": "custom_timetookadvil",
        "custom": True
      }
    ],
    "Contributors": [
      {
          "name": "Frequent Use of Medications",
          "id": "frequentMedUse",
          "explanation": "Calculated medication use, to let you know if you might want to think about cutting back.",
          "fieldDescription": "Number of pills you took",
          "field": "calculated medication use",
          "condition": True,
          "recommendingGoals": ["1a", "1b", "1c", "2", "3a", "3b", "3c"],
          "goal": {
              "freq": "Less",
              "threshold": 4,
              "timespan": "Month"
          },
          "significance": "If you use as-needed medications too frequently, they can start causing more migraines."
      },
      {
          "name": "Stress",
          "id": "stressToday",
          "explanation": "How stressed you were today",
          "fieldDescription": "3-point stress rating",
          "significance": "High stress levels can lead to more migraines",
          "field": "category scale",
          "recommendingGoals": ["1b", "3b"]
      },
      {
          "name": "Caffeine",
          "id": "caffeineToday",
          "explanation": "How much caffeine you had today",
          "fieldDescription": "3-point caffeine rating",
          "field": "category scale",
          "recommendingGoals": ["1b", "3b"]
      }
    ],
    "Other": [
      {
        "name": "Whether as-needed medication worked",
        "id": "whetherMedsWorked",
        "explanation": "Whether your as-needed medication improved your symptoms",
        "fieldDescription": "3-point symptoms improvement scale",
        "field": "category scale",
        "recommendingGoals": ["1b", "3c"]
      },
    ]
}


trackedData = []
numDataPoints = 31

def makeTime(hour, min):
    timeString = ''
    if hour < 10:
        timeString = '0'
    timeString += str(hour) + ":"
    if min < 10:
        timeString += '0'
    timeString += str(min)
    return timeString


def getRandomData(dataObject):
    field = dataObject['field']
    if field == "binary":
        rand = random.randrange(2)
        if rand == 0:
          return "Yes"
        return "No"
    elif field == "number":
        if "small" in dataObject['fieldDescription']:
            return random.randrange(4)
        return random.randrange(20) # dunno 
    elif field == "numeric scale":
        return random.randrange(1,11)
    elif field == "category scale":
        rand = random.randrange(2)
        if rand == 0:
            return "None"
        if rand == 1:
            return "Some"
        return "Lots"
    elif field == "time":
        randHour = random.randrange(24)
        randMin = random.randrange(0, 60)
        return makeTime(randHour, randMin)
    elif field == "time range":
        randStartHour = random.randrange(24)
        randStartMin = random.randrange(0, 60)
        randEndHour = random.randrange(randStartHour, 24)
        randEndMin = random.randrange(randStartMin, 60) # eh
        return {'start': makeTime(randStartHour, randStartMin),
                'end': makeTime(randEndHour, randEndMin)}
    elif field == "note":
        return "note contents moot"
    else:
        print("field not supported!!!!" + field)
      

def getRandomDate():
    randMonth = random.randrange(1, 4)
    randDay = random.randrange(1,29)
    randHour = random.randrange(0,24)
    randMin = random.randrange(0, 60)
    dateTracked = datetime.datetime(2019, randMonth, randDay, \
                                    randHour, randMin)
    startDate = datetime.datetime(2019, randMonth, randDay, 0, 0)
    endDate = startDate + datetime.timedelta(days=1)
    return [dateTracked, startDate, endDate]


def isoFormat(date):
    return date.isoformat() + ".000Z"

def addDatapoint():
    dataPoint = {}
    for dataType, dataObjectList in categories.items():
        dataPoint[dataType] = {}
        for dataObject in dataObjectList:
            rand = random.randrange(5)
            if rand != 0: # to have some null data 
                dataPoint[dataType][dataObject['id']] =\
                                     getRandomData(dataObject)
    dateTracked, startDate, endDate = getRandomDate()
    dataPoint['dateTracked'] = isoFormat(dateTracked) # 2019-03-06T19:04:49.572Z"
    dataPoint['startTime'] = isoFormat(startDate) # "2019-03-07T00:00:00.000Z",
    dataPoint['endTime'] = isoFormat(endDate) # "2019-03-06T00:00:00.000Z",
    dataPoint['allDay'] = 'true'
    return dataPoint
    

def addDatapoints():
    for i in range(numDataPoints):
        trackedData.append(addDatapoint())
    print(json.dumps(trackedData, indent=4))



def main():
    addDatapoints()


if __name__ == '__main__':
    main()

