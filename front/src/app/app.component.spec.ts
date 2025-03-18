function cov_5is6qxmvy() {
  var path = "C:\\laragon\\www\\projets openclassrooms\\projet_test_java_a_sup\\front\\src\\app\\app.component.spec.ts";
  var hash = "9470bb90fa2c89c906f3fcaf1755a4a861a7721b";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "C:\\laragon\\www\\projets openclassrooms\\projet_test_java_a_sup\\front\\src\\app\\app.component.spec.ts",
    statementMap: {
      "0": {
        start: {
          line: 10,
          column: 0
        },
        end: {
          line: 29,
          column: 3
        }
      },
      "1": {
        start: {
          line: 11,
          column: 2
        },
        end: {
          line: 22,
          column: 5
        }
      },
      "2": {
        start: {
          line: 12,
          column: 4
        },
        end: {
          line: 21,
          column: 27
        }
      },
      "3": {
        start: {
          line: 24,
          column: 2
        },
        end: {
          line: 28,
          column: 5
        }
      },
      "4": {
        start: {
          line: 25,
          column: 20
        },
        end: {
          line: 25,
          column: 57
        }
      },
      "5": {
        start: {
          line: 26,
          column: 16
        },
        end: {
          line: 26,
          column: 41
        }
      },
      "6": {
        start: {
          line: 27,
          column: 4
        },
        end: {
          line: 27,
          column: 29
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 10,
            column: 25
          },
          end: {
            line: 10,
            column: 26
          }
        },
        loc: {
          start: {
            line: 10,
            column: 31
          },
          end: {
            line: 29,
            column: 1
          }
        },
        line: 10
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 11,
            column: 13
          },
          end: {
            line: 11,
            column: 14
          }
        },
        loc: {
          start: {
            line: 11,
            column: 25
          },
          end: {
            line: 22,
            column: 3
          }
        },
        line: 11
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 24,
            column: 30
          },
          end: {
            line: 24,
            column: 31
          }
        },
        loc: {
          start: {
            line: 24,
            column: 36
          },
          end: {
            line: 28,
            column: 3
          }
        },
        line: 24
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0
    },
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "9470bb90fa2c89c906f3fcaf1755a4a861a7721b"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_5is6qxmvy = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_5is6qxmvy();
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { AppComponent } from './app.component';
cov_5is6qxmvy().s[0]++;
describe('AppComponent', () => {
  cov_5is6qxmvy().f[0]++;
  cov_5is6qxmvy().s[1]++;
  beforeEach(async () => {
    cov_5is6qxmvy().f[1]++;
    cov_5is6qxmvy().s[2]++;
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, MatToolbarModule],
      declarations: [AppComponent]
    }).compileComponents();
  });
  cov_5is6qxmvy().s[3]++;
  it('should create the app', () => {
    cov_5is6qxmvy().f[2]++;
    const fixture = (cov_5is6qxmvy().s[4]++, TestBed.createComponent(AppComponent));
    const app = (cov_5is6qxmvy().s[5]++, fixture.componentInstance);
    cov_5is6qxmvy().s[6]++;
    expect(app).toBeTruthy();
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJIdHRwQ2xpZW50TW9kdWxlIiwiVGVzdEJlZCIsIk1hdFRvb2xiYXJNb2R1bGUiLCJSb3V0ZXJUZXN0aW5nTW9kdWxlIiwiZXhwZWN0IiwiQXBwQ29tcG9uZW50IiwiZGVzY3JpYmUiLCJiZWZvcmVFYWNoIiwiY29uZmlndXJlVGVzdGluZ01vZHVsZSIsImltcG9ydHMiLCJkZWNsYXJhdGlvbnMiLCJjb21waWxlQ29tcG9uZW50cyIsIml0IiwiZml4dHVyZSIsImNyZWF0ZUNvbXBvbmVudCIsImFwcCIsImNvbXBvbmVudEluc3RhbmNlIiwidG9CZVRydXRoeSJdLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQuc3BlYy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwQ2xpZW50TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBUZXN0QmVkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZS90ZXN0aW5nJztcclxuaW1wb3J0IHsgTWF0VG9vbGJhck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3Rvb2xiYXInO1xyXG5pbXBvcnQgeyBSb3V0ZXJUZXN0aW5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyL3Rlc3RpbmcnO1xyXG5pbXBvcnQgeyBleHBlY3QgfSBmcm9tICdAamVzdC9nbG9iYWxzJztcclxuXHJcbmltcG9ydCB7IEFwcENvbXBvbmVudCB9IGZyb20gJy4vYXBwLmNvbXBvbmVudCc7XHJcblxyXG5cclxuZGVzY3JpYmUoJ0FwcENvbXBvbmVudCcsICgpID0+IHtcclxuICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcclxuICAgIGF3YWl0IFRlc3RCZWQuY29uZmlndXJlVGVzdGluZ01vZHVsZSh7XHJcbiAgICAgIGltcG9ydHM6IFtcclxuICAgICAgICBSb3V0ZXJUZXN0aW5nTW9kdWxlLFxyXG4gICAgICAgIEh0dHBDbGllbnRNb2R1bGUsXHJcbiAgICAgICAgTWF0VG9vbGJhck1vZHVsZVxyXG4gICAgICBdLFxyXG4gICAgICBkZWNsYXJhdGlvbnM6IFtcclxuICAgICAgICBBcHBDb21wb25lbnRcclxuICAgICAgXSxcclxuICAgIH0pLmNvbXBpbGVDb21wb25lbnRzKCk7XHJcbiAgfSk7XHJcblxyXG4gIGl0KCdzaG91bGQgY3JlYXRlIHRoZSBhcHAnLCAoKSA9PiB7XHJcbiAgICBjb25zdCBmaXh0dXJlID0gVGVzdEJlZC5jcmVhdGVDb21wb25lbnQoQXBwQ29tcG9uZW50KTtcclxuICAgIGNvbnN0IGFwcCA9IGZpeHR1cmUuY29tcG9uZW50SW5zdGFuY2U7XHJcbiAgICBleHBlY3QoYXBwKS50b0JlVHJ1dGh5KCk7XHJcbiAgfSk7XHJcbn0pO1xyXG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWVZOzs7Ozs7Ozs7QUFmWixTQUFTQSxnQkFBVCxRQUFpQyxzQkFBakM7QUFDQSxTQUFTQyxPQUFULFFBQXdCLHVCQUF4QjtBQUNBLFNBQVNDLGdCQUFULFFBQWlDLDJCQUFqQztBQUNBLFNBQVNDLG1CQUFULFFBQW9DLHlCQUFwQztBQUNBLFNBQVNDLE1BQVQsUUFBdUIsZUFBdkI7QUFFQSxTQUFTQyxZQUFULFFBQTZCLGlCQUE3Qjs7QUFHQUMsUUFBUSxDQUFDLGNBQUQsRUFBaUIsTUFBTTtFQUFBO0VBQUE7RUFDN0JDLFVBQVUsQ0FBQyxZQUFZO0lBQUE7SUFBQTtJQUNyQixNQUFNTixPQUFPLENBQUNPLHNCQUFSLENBQStCO01BQ25DQyxPQUFPLEVBQUUsQ0FDUE4sbUJBRE8sRUFFUEgsZ0JBRk8sRUFHUEUsZ0JBSE8sQ0FEMEI7TUFNbkNRLFlBQVksRUFBRSxDQUNaTCxZQURZO0lBTnFCLENBQS9CLEVBU0hNLGlCQVRHLEVBQU47RUFVRCxDQVhTLENBQVY7RUFENkI7RUFjN0JDLEVBQUUsQ0FBQyx1QkFBRCxFQUEwQixNQUFNO0lBQUE7SUFDaEMsTUFBTUMsT0FBTyw0QkFBR1osT0FBTyxDQUFDYSxlQUFSLENBQXdCVCxZQUF4QixDQUFILENBQWI7SUFDQSxNQUFNVSxHQUFHLDRCQUFHRixPQUFPLENBQUNHLGlCQUFYLENBQVQ7SUFGZ0M7SUFHaENaLE1BQU0sQ0FBQ1csR0FBRCxDQUFOLENBQVlFLFVBQVo7RUFDRCxDQUpDLENBQUY7QUFLRCxDQW5CTyxDQUFSIn0=
