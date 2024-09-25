# Task Manager App - React Native Version

A cross-platform mobile application for efficient task management, developed using React Native.

## Features

- Create, edit, and delete tasks
- Categorize tasks and set priorities
- Offline functionality with local data storage
- File attachment support for tasks
- Search and filter tasks
- Dark mode support
- Cross-platform compatibility (iOS and Android)

## Technologies Used

- React Native
- JavaScript
- AsyncStorage for local data persistence
- React Hooks and Context API for state management
- React Navigation for routing
- date-fns for date handling

## Installation

1. Ensure you have Node.js and React Native CLI installed on your machine
2. Clone the repository:
   ```
   git clone https://github.com/praiseOjay/TaskManager.git
   ```
3. Navigate to the project directory:
   ```
   cd TaskManager
   ```
4. Install dependencies:
   ```
   npm install
   ```
5. For iOS, install CocoaPods dependencies:
   ```
   cd ios && pod install && cd ..
   ```
6. Start the app:
   - For Android: `npx react-native run-android`
   - For iOS: `npx react-native run-ios`

## Project Structure

The app follows the MVVM (Model-View-ViewModel) architecture:

- `src/components/`: Reusable UI components
- `src/screens/`: Main app screens
- `src/contexts/`: React Context for state management
- `src/services/`: Business logic and data operations
- `src/utils/`: Utility functions and helpers

## Testing

To run the tests:

```
npm test
```

## Performance

Performance metrics, including app startup time, frame render time, memory usage, and battery consumption, are available in the full project report.

## Contributing

Contributions to improve the app are welcome. Please feel free to submit issues or pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

Praise Ojerinola - Ojerinolapraise@gmail.com

Project Link: https://github.com/praiseOjay/TaskManager.git
